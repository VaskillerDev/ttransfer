import ILogger from "ttransfer_util/dist/src/logger/ILogger";
import { Telegraf, Markup } from "telegraf";
import PgConnector from "../connector/PgConnector";

namespace tg {
  // micro-cache:
  const USER_DATA_CACHE: Map<string, string> = new Map<string, string>();
  const LOCALE_DATA_CACHE: Map<string, JSON> = new Map<string, JSON>();
  // dialog:
  let MSG_DOWNLOAD_MEDIA = "📥 Загрузить медиа";
  let MSG_DELETE_MEDIA = "📤 Удалить медиа";
  // queries (pg):
  const TABLE_USER_DATA = process.env.PG_TABLE_USER_DATA;
  const TABLE_USER_LOCALE = process.env.PG_TABLE_USER_LOCALE;
  const SELECT_LOCALE_COUNTRY_CODE_AND_CONTENT = `SELECT country_code,content FROM ${TABLE_USER_LOCALE}`;
  const SELECT_USER_ID = `SELECT * FROM ${TABLE_USER_DATA} WHERE username = $1`;
  const INSERT_NEW_USER = `INSERT INTO ${TABLE_USER_DATA}  (username, language_code, user_id) VALUES ($1,$2,$3)`;

  export class Bot {
    private readonly logger: ILogger;
    private readonly tgInstance: Telegraf<any>;
    private readonly connector: IConnector;

    constructor(logger: ILogger, connector: IConnector) {
      this.logger = logger;
      this.connector = connector;
      this.tgInstance = new Telegraf<any>(process.env.TG_BOT_TOKEN as string);
      const pgConnector = this.connector as PgConnector;
      //this.tgInstance.use(Telegraf.log());

      pgConnector.query(async (pgClient) => {
        try {
          const maybeRes = await pgClient.query({
            text: SELECT_LOCALE_COUNTRY_CODE_AND_CONTENT,
            rowMode: "array",
          });
          const rows = maybeRes.rows;

          for (const index in rows) {
            const row = rows[index];
            if (!row && !row[0] && !row[1]) return;
            const languageCode: string = row[0];
            const content: JSON = row[1];
            LOCALE_DATA_CACHE.set(languageCode, content);
          }
        } catch (e) {
          logger.err(e.stack);
        }
      });

      // start
      this.tgInstance.command("start", (ctx) => {
        const pgConnector = this.connector as PgConnector;
        const username = ctx.from.username;
        const languageCode = ctx.from.language_code;
        const userId = ctx.from.id;

        if (!userId) {
          logger.err("'start' -> user_id not found");
          return;
        }

        pgConnector.query(async (pgClient) => {
          try {
            const maybeRes = await pgClient.query(SELECT_USER_ID, [userId]); // select user if is exist
            const user = maybeRes.rows[0];
            if (!user)
              await pgClient.query(INSERT_NEW_USER, [
                // create new user
                username,
                languageCode,
                userId,
              ]);
          } catch (e) {
            logger.err(e.stack);
          }
        });

        ctx.reply(
          "Select language:",
          Markup.keyboard([["ENG", "RU"]])
            .oneTime()
            .resize()
            .extra()
        );
      });

      this.tgInstance.hears("ENG", (ctx) => ctx.reply("Yay!"));
      this.tgInstance.hears("RU", (ctx) => ctx.reply("Free hugs. Call now!"));

      // menu
      this.tgInstance.command("menu", ({ reply }) => {
        reply(
          `Привет! 
    Я tTransfer бот - помогаю создавать временные анонимные ссылки на медиа-файлы из telegram в сети.
    1. Выберите как выгрузить файл
    2. Пришлите файл
    3. Получите ссылку
    Так чем могу помочь?`,
          Markup.keyboard([[MSG_DOWNLOAD_MEDIA, MSG_DELETE_MEDIA]])
            .oneTime()
            .resize()
            .extra()
        );
      });

      this.tgInstance.hears(MSG_DOWNLOAD_MEDIA, (ctx) => ctx.reply("Yay!"));
      this.tgInstance.hears(MSG_DELETE_MEDIA, (ctx) =>
        ctx.reply("Free hugs. Call now!")
      );

      this.tgInstance.launch();
    }
  }
}

export default tg;
