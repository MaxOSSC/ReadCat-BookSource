/**
 * 文件编码: UTF-8(如不是UTF8编码可能会导致乱码或未知错误)
 * 禁止使用import、require导入模块
 * 若使用import * from *、import()、require()导入模块, 无法通过插件校验
 * import fs from 'fs';
 * import('fs').then().catch();
 * require('fs');
 */
plugin.exports = class Plugin implements BookSource {
  /**
   * 静态属性 ID  自动生成
   * 该值需符合正则表达式: [A-Za-z0-9_-]
   */
  public static readonly ID: string = "qJWg2IC7FdFHFL6KRPwZG";
  /**
   * 静态属性 TYPE  必填
   * 插件类型
   * 值类型:
   * plugin.type.BOOK_SOURCE  - 表示该插件为书源类
   * plugin.type.BOOK_STORE   - 表示该插件为书城类
   */
  public static readonly TYPE: number = plugin.type.BOOK_SOURCE;
  /**
   * 静态属性 GROUP  必填
   * 插件分组
   */
  public static readonly GROUP: string = "👻MaxOS";
  /**
   * 静态属性 NAME  必填
   * 插件名称
   */
  public static readonly NAME: string = "奇迹小说";
  /**
   * 静态属性 VERSION  必填
   * 插件版本  用于显示
   */
  public static readonly VERSION: string = "1.0.0";
  /**
   * 静态属性 VERSION_CODE  必填
   * 插件版本代码  用于比较本地插件与静态属性PLUGIN_FILE_URL所指插件的版本号
   */
  public static readonly VERSION_CODE: number = 0;
  /**
   * 静态属性 PLUGIN_FILE_URL  必填
   * 插件http、https链接, 如: http://example.com/plugin-template.js
   */
  public static readonly PLUGIN_FILE_URL: string =
    "https://raw.kkgithub.com/MaxOSSC/ReadCat-BookSource/main/Plugin/maxos-qijizuopin.com.ts.js";
  /**
   * 静态属性 BASE_URL  必填
   * 插件请求目标链接
   */
  public static readonly BASE_URL: string = "https://www.qijizuopin.com";
  /**
   * 静态属性 REQUIRE  可选
   * 要求用户填写的值
   */
  public static readonly REQUIRE: Record<string, string> = {};
  private request: ReadCatRequest;
  private store: Store;
  private cheerio: CheerioModule.load;
  private nanoid: () => string;
  constructor(options: PluginConstructorOptions) {
    const { request, store, cheerio, nanoid } = options;
    /**
     * request
     *   function get(url, config)
     *     url: string    请求链接
     *     config(可选): {
     *                     params(可选): { [key: string]: number | string | boolean } | URLSearchParams,    请求参数
     *                     headers(可选): { [key: string]: string },    请求头
     *                     proxy(可选): boolean    是否开启代理,
     *                     charset(可选): string    字符集, 默认为自动获取, 当出现乱码时请指定字符集
     *                     urlencode(可选): string   URL编码, 默认UTF8
     *                     maxRedirects(可选): number  最大重定向数, 为0时则禁止重定向
     *                     responseType(可选): 'arraybuffer' | 'text' | 'json'  响应体类型, 默认text
     *                     signal(可选): AbortSignal  中止信号
     *                   }
     *   return: Promise<{ body, code, headers }>
     *   function post(url, config)
     *     url: string    请求链接
     *     config(可选): {
     *                     params(可选): { [key: string]: number | string | boolean }, | URLSearchParams,    请求参数
     *                     headers(可选): { [key: string]: string },    请求头
     *                     proxy(可选): boolean    是否开启代理
     *                     charset(可选): string    字符集, 默认为自动获取, 当出现乱码时请指定字符集
     *                     urlencode(可选): string   URL编码, 默认UTF8
     *                     maxRedirects(可选): number  最大重定向数, 为0时则禁止重定向
     *                     responseType(可选): 'arraybuffer' | 'text' | 'json'  响应体类型, 默认text
     *                     signal(可选): AbortSignal  中止信号
     *                   }
     *   return: Promise<{ body, code, headers }>
     *
     *   body: 响应体
     *   code: 响应码
     *   headers: 响应头
     */
    this.request = request;
    /**
     * 每个插件都自带仓库（最大存储4MB）, 您可向该仓库设置、获取、删除值
     * store
     *   function setStoreValue(key, value)
     *               key: string,
     *               value: any (JavaScript基本数据类型), 该值经过v8.serialize处理
     *   return Promise<void>
     *   function getStoreValue(key)
     *               key: string
     *   return Promise<any> (JavaScript基本数据类型)
     *   function removeStoreValue(key)
     *               key: string
     *   return Promise<void>
     */
    this.store = store;
    /**
     * function cheerio(html: string)
     * 该值是模块cheerio中的load方法, 用法 const $ = cheerio(HTMLString)
     * 文档: https://cheerio.nodejs.cn/docs/basics/loading#load
     */
    this.cheerio = cheerio;
    /**
     * function nanoid
     * 获取21位随机字符串
     */
    this.nanoid = nanoid;
  }

  async search(searchkey: string): Promise<SearchEntity[]> {
    const { body } = await this.request.get(`${Plugin.BASE_URL}/so/${searchkey}`);
    const $ = this.cheerio(body);
    const dis = $("main.flex > div");
    console.log(dis.length);
    const results: SearchEntity[] = [];
    for (const di of dis) {
      const d = $(di).find("div:nth-child(1)");
      const c = $(di).find("div:nth-child(1) p");
      // console.log(d.children("h3").text());
      // console.log(d.children("span").text().substring(3));
      // console.log(d.children("img").attr("src"));
      // console.log(Plugin.BASE_URL + d.children("a").attr("href"));
      // console.log(c.children("a").text().substring(5));
      results.push({
        bookname: d.children("h3").text(),
        author: d.children("span").text().substring(3),
        coverImageUrl: d.children("img").attr("src"),
        detailPageUrl: Plugin.BASE_URL + d.children("a").attr("href"),
        latestChapterTitle: c.children("a").text().substring(5),
      });
    }
    return results;
  }

  async getDetail(detailPageUrl: string): Promise<DetailEntity> {
    const { body } = await this.request.get(detailPageUrl);
    const $ = this.cheerio(body);
    const bookname = $("h1").text();
    const author = $("span.text-sm.text-primarySix").text().substring(3);
    const latestChapterTitle = $("p.mb-7 > a").text();
    const coverImageUrl = $("biv.book-cover img").attr("src");
    const intro = $("p.mb-20").text();
    // console.log(detailPageUrl);
    const items = $("div.flex.flex-row.flex-wrap > a");
    const chapterList: Chapter[] = [];
    for (const item of items) {
      chapterList.push({
        title: $(item).text(),
        url: $(item).attr("href"),
      });
    }
    return {
      bookname,
      author,
      latestChapterTitle,
      coverImageUrl,
      intro,
      chapterList,
    };
  }

  async getTextContent(chapter: Chapter): Promise<string[]> {
    const { body } = await this.request.get(chapter.url);
    const $ = this.cheerio(body);
    const texts = $(".content > p")
      .map((index, element) => $(element).text().trim())
      .get();
    return texts;
  }
};
