function makeView(tps, out, twds, wds, curc, caut, cit) {
  var list = tps.list, cts = tps.categories;
  if (cit == -1) {
    if (caut != -1) out.push("<h1 style=\"font-size:2.4em\"><a href=\"/templates\" class=\"clc\">×</a> <b>" + tps.authors[caut][1] + "</b></h1>");
    var oi = out.length;
    out.push("");
    var N = 0, U = 0, S = 0;
    for (var i = 0; i < list.length; i++) {
      let tpl = list[i], cat = tpl[4], pcat = cat - (cat % 10);
      if (caut != -1 && tpl[0] != caut) continue;
      if (curc != -1) {
        if ((curc % 10) == 0) {
          if (pcat != curc) continue;
        } else if (curc != cat) continue;
      }
      if (twds != "") {
        var occ = 0, tot = (tpl[7] + " " + tpl[8] + " " + tps.authors[tpl[0]] + " " + cts["c" + tpl[4]]).toLowerCase();
        for (var j = 0; j < wds.length; j++) {
          if (tot.indexOf(wds[j]) != -1) occ++;
        }
        if (occ == 0) continue;
      }
      makeItem(tps, i, cts, out, false);
      N++;
      U += tpl[6];
      S += tpl[7];
    }
    if (caut != -1) out[oi] = "<p>" + N + " Templates • " + printNum(U) + " uses • " + printBytes(S) + "</p>";
  } else {
    //out.push("<div id=\"back\"><span class=\"back\" onclick=\"backClicked()\">&lt; Back</span></div>");
    let tpl = list[cit];
    makeItem(tps, cit, cts, out, true);
    out.push("<iframe src=\"comments.html#" + tempID(tpl) + "\" frameborder=\"0\" style=\"border:none;  max-width:800px; width:calc(100% - 20px); height:800px; background-color:white;\"></iframe>");
    /*
    out.push("<iframe src=\"https://www.facebook.com/plugins/comments.php?href=https://photopea.com/templates\" scrolling=\"yes\" frameborder=\"0\" style=\"border:none; width:calc(100% - 20px); height:600px; background-color:white;\"></iframe>");  */
    /*
    out.push("<div id=\"fb-root\"></div> <script async defer crossorigin=\"anonymous\" src=\"https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v10.0&appId=1709573295939738&autoLogAppEvents=1\" nonce=\"wZ5o5487\"></script>");
    out.push("<div class=\"fb-comments\" data-href=\"https://photopea.com/templates\" data-width=\"600\" data-numposts=\"5\"></div>");
    */
  }
}

function shorten(str, lim) {
  return (str.length < lim) ? str : str.slice(0, lim - 3) + "...";
}

function mmd(e) {
  var t = e.target;  //if(t.tagName.toLowercase()!="img") return;
  var r = t.getBoundingClientRect();
  t.setAttribute("style", "object-position: " + (100 * e.offsetX / r.width) + "% " + (100 * e.offsetY / r.height) + "%;");
}

function mmo(e) {
  var t = e.target;
  t.setAttribute("style", "object-position: 50% 50%;");
}

function toID(str) {
  return str.toLowerCase().replace(/\s+/g, "-") + ".html";
}

function makeItem(tps, ind, cts, lst, big) {
  var tpl = tps.list[ind];
  var rst = window.innerWidth - (245 + 30);  //console.log(iw);
  var num = 1;
  while (rst / num > 300) num++;
  var cc = Math.floor(rst / num);  //console.log(cc);
  var isz = cc - 16;  //console.log(isz);

  var tit = escapeHtml(tpl[8]);
  let lim = ~~(isz / 9);  //console.log(tpl);

  if (big) isz = rst / 2;
  var wi = (isz + "px");
  var hi = ((isz * 9.3 / 16) + "px");

  lst.push("<div class=\"item " + (big ? "flexrow" : "tiny") + "\" " + (big ? "" : "style=\"width:" + wi + ";\" ") + ">");

  var iurl = tpl[3]; //(Math.random()<0.5?"wide.png":"tall.png");  // tpl[3]
  var aurl = "//www.Photopea.com#t" + tempID(tpl);
  //*


  lst.push("<div style=\"width:" + wi + "; min-width:" + wi + "; height:" + hi + "\">");  // ict
  if (!big) lst.push("<a href=\"t-" + tempID(tpl) + "\" title=\"" + tit + "\">");
  lst.push("<img src=\"" + iurl + "\" loading=\"lazy\" onmousemove=\"mmd(event)\" onmouseout=\"mmo(event)\" "
    + (big ? "onclick=\"itemClicked(" + ind + ")\" title=\"Open &quot;" + tit + "&quot;\"" : "") + " />");
  //if(big) lst.push("<div class=\"openimg\" style=\"width:"+wi+"; height:"+hi+";\" "+(big ? "onclick=\"itemClicked("+ind+")\" title=\"Open &quot;"+tit+"&quot;\"" : "")+"><br/><br/>Open</div>");
  if (!big) lst.push("</a>");
  lst.push("</div>"); // ict
  lst.push("<div class=\"" + "post" + (big ? "_big" : "") + "\">"); // cmt

  if (!big) lst.push("<a class=\"clc\" href=\"t-" + tempID(tpl) + "\" title=\"" + tit + "\">");
  var tag = big ? "h1" : "span";
  lst.push("<" + tag + " class=\"title " + (big ? "t1" : "t2") + "\">" + (big ? tit : shorten(tit, lim)) + "</" + tag + ">");
  if (!big) lst.push("</a>");

  var au = tps.authors[tpl[0]];
  var cat = cts["c" + tpl[4]];
  lst.push("<span>")
  lst.push("By <a class=\"clc\" href=\"a-" + au[0] + "\">" + (big ? au[1] : shorten(au[1], ~~(lim * 0.7))) + "</a>");
  lst.push(" in <a class=\"clc\" href=\"c-" + toCat(cat) + "\">" + cat + "</a>");
  lst.push("</span>");

  if (big) {
    lst.push("<p>" + findLinks(escapeHtml(tpl[9])) + "</p>");
    lst.push("<p style=\"font-size:1.5em; margin-bottom: 0em;\">");
    var dstr = printDate(tpl[1]);
    //lst.push("<b class=\"clickable\" onclick=\"itemClicked("+ind+")\">Open</b>");
    //lst.push("  <a href=\""+aurl+"\" target=\"_blank\" class=\"clickable\" ><b>Open Separately</b></a>");

    lst.push("<span title=\"" + printNum(tpl[5]) + " views" + "\">" + printNum(tpl[6]) + " uses</span>")
    lst.push(" • " + printBytes(tpl[7]));
    lst.push(" • <span title=\"" + ((0.001 * Date.now() - tpl[1]) / (60 * 60 * 24)).toFixed(2) + " days ago\">" + dstr + "</span>");//  lst.push("<br/>");


    //lst.push("<br/>");  lst.push(tpl[6]+" uses");
    lst.push("</p>");
    lst.push("<p style=\"font-size:1.2em; margin-top:0.5em;\">");
    lst.push("<a href=\"" + aurl + "\" target=\"_blank\" class=\"clickable\" >photopea.com#t" + tempID(tpl) + "</a>");
    lst.push("<br/>");
    lst.push("</p>");
  } else {
    lst.push("<br/><span>");

    var us = tpl[6], ss = "";  //us = Math.floor(Math.random()*1e9);
    if (us < 1000) ss = us + "";
    else if (us < 1e6) ss = (us / 1e3).toFixed(us < 1e4 ? 1 : 0) + "K";
    else if (us < 1e9) ss = (us / 1e6).toFixed(us < 1e7 ? 1 : 0) + "M";

    var sl = ss.length - 3;
    if (ss[sl] == "." && ss[sl + 1] == "0") ss = ss.slice(0, sl) + ss[sl + 2];

    lst.push(ss + " uses");

    var sts = [60, 60, 24, 30, 12, 10000];
    var uns = ["sec", "min", "hour", "day", "month", "year"];
    var td = (Date.now() / 1000) - tpl[1], ts = "";
    let lim = 1;
    for (var i = 0; i < sts.length; i++) {
      var ol = lim;
      lim *= sts[i];
      if (td < lim) {
        var n = Math.round(td / ol);
        ts = n + " " + uns[i] + (n > 1 ? "s" : "");
        break;
      }
    }

    lst.push(" • " + ts + " ago");//  lst.push("<br/>");
    //lst.push( "By <a class=\"clc\" href=\"a-"+au[0]     +"\">" +(big?au[1]:shorten(au[1],~~(lim*0.7)))+"</a>");
    //lst.push(" in <a class=\"clc\" href=\"c-"+toCat(cat)+"\">" + cat+"</a>");
    lst.push("</span>");
  }
  lst.push("</div>"); // cmt
  lst.push("</div>");
}

function printBytes(bs) {
  //var bs = this.cimage.byteLength;
  //var zrs=0;  while((bs>>>(zrs+10))!=0) zrs+=10;
  var bst = bs.toString(2);
  var zrs = 0;
  while (zrs + 10 < bst.length) zrs += 10;
  var num = (bs / Math.pow(2, zrs)), rn = Math.round(num), fxd = num.toFixed(1);
  num = (rn > 99 || fxd[fxd.length - 1] == "0") ? rn : fxd;

  var ext = ["B", "KB", "MB", "GB", "TB", "PB"][Math.floor(zrs / 10)];
  return num + " " + ext;
}

function printDate(d) {
  var dt = new Date(d * 1000);
  var mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"][dt.getMonth()];
  return mon + " " + (dt.getDate()) + ", " + dt.getFullYear();
}

function printNum(f) {
  return f.toLocaleString('en-US', {maximumFractionDigits: 2});
}

function tempID(tpl) {
  return tpl[2].split("").reverse().join("");
}

function isWhite(c) {
  return c == " " || c == "\n" || c == "\t";
}

function isChar(c) {
  c = c.charCodeAt(0);
  return (65 <= c && c <= 90) || (97 <= c && c <= 122);
}

function findLinks(str) {
  //return str;
  var iod = [];
  for (let i = 0; i < str.length - 2; i++) if (str[i] == "." && isChar(str[i + 1]) && isChar(str[i + 2])) iod.push(i);
  iod.reverse();  //console.log(iod);

  var omit = ["https://", "http://", "//", "www."];

  var min = 1e9;
  for (let i = 0; i < iod.length; i++) {
    var i0 = iod[i], i1 = i0;
    if (i0 > min) continue;

    while (i0 > 0 && !isWhite(str[i0 - 1])) i0--;
    while (i1 < str.length - 1 && !isWhite(str[i1 + 1])) i1++;
    if (str[i0] == " ") i0++;
    if (str[i1] == " ") i1--;
    var mid = str.slice(i0, i1 + 1), url = mid;
    for (var j = 0; j < omit.length; j++) if (mid.startsWith(omit[j])) mid = mid.slice(omit[j].length);
    if (url.indexOf("//") == -1) url = "//" + url;
    str = str.slice(0, i0) + "<a href=\"" + url + "\" target=\"_blank\">" + mid + "</a>" + str.slice(i1 + 1);
    min = i0;
  }
  return str//.replaceAll("\n","<br/>");
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getCatCounts(tps) {
  var list = tps.list, cts = tps.categories;
  var ccnt = JSON.parse(JSON.stringify(cts));
  for (let cat in ccnt) ccnt[cat] = 0;
  for (var i = 0; i < list.length; i++) {
    var tpl = list[i], cat = tpl[4], pcat = cat - (cat % 10);
    ccnt["c" + cat]++;
    if (cat != pcat) ccnt["c" + pcat]++;
  }
  return ccnt;
}

function getCats(tps, curr, out) {
  var cts = tps.categories, ccnt = getCatCounts(tps);
  out.push("<span class=\"cat_title\">CATEGORIES</span>");
  var hr = window.location.href;
  hr = hr.slice(0, hr.lastIndexOf("/") + 1);
  for (var cat in cts) {
    if (ccnt[cat] == 0) continue;
    var cw = parseInt(cat.slice(1)), isTop = (cw % 10) == 0;  //console.log(cw);
    out.push("<a href=\"" + ((cw == curr) ? hr : ("https://www.photopea.com/templates/c-" + toCat(cts[cat]))) + "\">");
    out.push("<div class=\"cat" + (isTop ? " top" : "") + (cw == curr ? " blue" : "") + " clickable\" >");  // onclick=\"catClicked("+cw+")\"
    out.push(cts[cat]);
    out.push("<span class=\"count\">" + ccnt[cat] + "</span>");
    out.push("</div>");
    out.push("</a>");
  }
}

function toCat(cat) {
  var ioa = cat.indexOf(" &");
  if (ioa != -1) cat = cat.slice(0, ioa) + cat.slice(ioa + 2);
  return cat.toLowerCase().replace(/\s+/g, "-");
}


function cost0(v) {
  var age = (Date.now() * 0.001 - v[1]) / (60 * 60 * 24);  // age in days
  var cst = (v[6] + 1) / age;  // usages per day
  var ext = 20 * Math.pow(Math.PI, -age * 0.5);
  //console.log(age,cst,ext)

  return cst + ext;
  /*
  var ts = Math.max(0, v[1]-1134028003);
  var x = v[6];
  var y = 1;
  var z = Math.max(1,Math.abs(x));
  return getBaseLog(10, z) + (y*ts/45000);  // 45000
  */
}

function cost1(v) {
  return v[1];
}

function cost2(v) {
  return v[6];
}

//function getBaseLog(x, y) {  return Math.log(y) / Math.log(x);  }