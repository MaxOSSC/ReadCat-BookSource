plugin.exports=class a{static ID="p56OTeTOmkPCEt9b4puj1";static TYPE=plugin.type.BOOK_SOURCE;static GROUP="MaxOS";static NAME="顶点小说";static VERSION="1.0.0";static VERSION_CODE=0;static PLUGIN_FILE_URL="";static BASE_URL="http://www.23uswx.org";static REQUIRE={};request;store;cheerio;nanoid;constructor(t){var{request:t,store:e,cheerio:r,nanoid:i}=t;this.request=t,this.store=e,this.cheerio=r,this.nanoid=i}async search(t){var t=(await this.request.get(a.BASE_URL+"/modules/article/search.php?q="+t))["body"],e=this.cheerio(t),t=e("#nr"),r=(console.log(t),[]);for(const c of t){var i=e(c).find("td"),s=/\/(\d+)_(\d+)\//,s=e(i.get(0)).children("a").attr("href").match(s),o=s[1],s=s[2];console.log(o,s),r.push({bookname:e(i.get(0)).children("a").text(),author:e(i.get(2)).text(),coverImageUrl:a.BASE_URL+`/files/article/image/${o}/${s}/${s}s.jpg`,detailPageUrl:e(i.get(0)).children("a").attr("href"),latestChapterTitle:e(i.get(1)).text()})}return r}async getDetail(t){var t=(await this.request.get(t))["body"],e=this.cheerio(t),t=e("#info > h1").text(),r=e("#info > p:nth-child(2) > a").text(),i=e("#info > p:nth-child(5) > a").text(),s=e("#fmimg > img").attr("src"),o=e("#intro").text(),c=[];for(const n of e("#list > dl > dd")){var h=e(n).children("a");c.push({title:h.text(),url:a.BASE_URL+h.attr("href")})}return{bookname:t,author:r,latestChapterTitle:i,coverImageUrl:s,intro:o,chapterList:c}}async getTextContent(t){t=(await this.request.get(t.url)).body,t=this.cheerio(t);return t("#content div").remove("div"),t("#content").html().split("<br>").filter(t=>t.trim())}};