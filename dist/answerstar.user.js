// ==UserScript==
// @name         答卷星
// @description  最强问卷星助手，答案共享备份，真自动满分，自动提交……
// @version      1.5.0
// @author       ZhangZisu <admin@zhangzisu.cn>
// @license      MIT
//
// @match        http*://ks.wjx.top/*
// @match        http*://www.wjx.cn/*
//
// @grant        GM.addStyle
// @grant        GM.xmlHttpRequest
// @grant        GM.notification
//
// @connect      v4.ipv6-test.com
// @connect      ip-api.com
// @connect      fdd.19260817.net
// @connect      paste.ubuntu.com
// @website      https://djx.zhangzisu.cn/
// @icon         https://djx.zhangzisu.cn/static/answerstar_logo.png
// ==/UserScript==

!function(e) {
    var t = {};
    function r(n) {
        if (t[n]) return t[n].exports;
        var i = t[n] = {
            i: n,
            l: !1,
            exports: {}
        };
        return e[n].call(i.exports, i, i.exports, r), i.l = !0, i.exports;
    }
    r.m = e, r.c = t, r.d = function(e, t, n) {
        r.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: n
        });
    }, r.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        });
    }, r.t = function(e, t) {
        if (1 & t && (e = r(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var n = Object.create(null);
        if (r.r(n), Object.defineProperty(n, "default", {
            enumerable: !0,
            value: e
        }), 2 & t && "string" != typeof e) for (var i in e) r.d(n, i, function(t) {
            return e[t];
        }.bind(null, i));
        return n;
    }, r.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default;
        } : function() {
            return e;
        };
        return r.d(t, "a", t), t;
    }, r.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
    }, r.p = "", r(r.s = 0);
}([ function(module, exports, __webpack_require__) {
    console.log("欢迎使用%c答卷星", "color: #1ea0fa");
    const pkg = __webpack_require__(1), {Base64: Base64} = __webpack_require__(2), toastr = __webpack_require__(4), ajax = __webpack_require__(7), bi = __webpack_require__(166), sl = __webpack_require__(167), t = __webpack_require__(168), c = __webpack_require__(170), wjx = __webpack_require__(171), utils = __webpack_require__(169);
    __webpack_require__(173);
    let problems = [], tid, statusElem, lastAns = "";
    const pageType = getPageType();
    function gets(e) {
        return localStorage.getItem(`fdd.${tid}.${e}`);
    }
    function getj(e) {
        try {
            return JSON.parse(gets(e));
        } catch (t) {
            return console.error(t), sets(e, ""), null;
        }
    }
    function sets(e, t) {
        localStorage.setItem(`fdd.${tid}.${e}`, t), updateStatus();
    }
    function setj(e, t) {
        sets(e, JSON.stringify(t)), updateStatus();
    }
    function systemNotify(e) {
        GM.notification({
            text: e,
            title: document.title,
            image: "https://djx.zhangzisu.cn/static/answerstar_logo.png"
        });
    }
    function allowCopyPaste() {
        document.oncontextmenu = null, document.ondragstart = null, document.onselectstart = null, 
        document.querySelectorAll("textarea").forEach(e => {
            e.onpaste = null;
        }), document.querySelectorAll("input").forEach(e => {
            e.onpaste = null;
        });
    }
    function redirToSecure() {
        /^http:\/\//.test(location.href) && (location.href = location.href.replace(/http/, "https"));
    }
    function redirToDesktop() {
        /wjx\.(top|cn)\/m\//.test(location.href) && (location.href = location.href.replace(/\/m\//, "/jq/"));
    }
    function showAllOnce() {
        document.querySelectorAll(".fieldset").forEach(e => {
            e.style.display = "";
        }), document.getElementById("submit_table").style.display = "";
        try {
            document.getElementById("btnNext").parentElement.parentElement.parentElement.parentElement.parentElement.style.display = "none";
        } catch (e) {}
    }
    function getPageType() {
        return /ks\.wjx\.top\/wjx\/join\/uploadMultiple/.test(location.href) ? 3 : /ks\.wjx\.top\/wjx\/join\/JoinActivityRank/.test(location.href) ? 4 : /(ks\.wjx\.top|www\.wjx\.cn)\/jq\//.test(location.href) ? 1 : /(ks\.wjx\.top|www\.wjx\.cn)\/wjx\/join\//.test(location.href) ? 2 : void 0;
    }
    function probParseAll() {
        const e = document.querySelectorAll(".div_question");
        problems = [ ...e.values() ].map(e => probParseOne(e)).filter(e => e), setj("p", problems.map(e => ({
            id: e.id,
            type: e.type,
            meta: e.meta
        })));
    }
    function probParseOne(e) {
        let r;
        return (r = c.parse(e)) || (r = t.parse(e)) || (r = bi.parse(e)) || (r = sl.parse(e)) ? r : (console.group("Unknow problem"), 
        console.log(e), void console.groupEnd());
    }
    function get(e, r) {
        switch (r) {
          case "c":
            return c.get(e);

          case "t":
            return t.get(e);

          case "bi":
            return bi.get(e);

          case "sl":
            return sl.get(e);
        }
        return "";
    }
    function hide(e, r) {
        switch (r) {
          case "c":
            return c.hide(e);

          case "t":
            return t.hide(e);
        }
    }
    function set(e, r, n, i) {
        if (i || !get(e, r)) switch (r) {
          case "c":
            return c.set(e, n);

          case "t":
            return t.set(e, n);

          case "bi":
            return bi.set(e, n);

          case "sl":
            return sl.set(e, n);
        }
    }
    function display(e, r, n) {
        switch (hide(e, r), r) {
          case "c":
            return c.display(e, n);

          case "t":
            return t.display(e, n);
        }
    }
    function probGetAll() {
        const e = getj("s") || {};
        for (const t of problems) {
            const r = get(t.elem, t.type);
            r && (e[t.id] = r);
        }
        return setj("s", e), gets("s");
    }
    function probSetAll(e, t) {
        const r = getj(e) || {};
        for (const e in r) {
            const n = problems.find(t => t.id === e);
            n ? set(n.elem, n.type, r[e], t) : console.warn(`ID ${e} not found`);
        }
    }
    function probDisplayAll(e) {
        const t = getj(e) || {};
        for (const e in t) {
            const r = problems.find(t => t.id === e);
            r ? display(r.elem, r.type, t[e]) : console.warn(`ID ${e} not found`);
        }
    }
    function probHideAll() {
        for (const e of problems) hide(e.elem, e.type);
    }
    function generateLink(e) {
        return confirm("是否附加元数据(很长)？") ? [ tid, Base64.encodeURI(getMetaDataStr()) ].join("$") : [ tid, Base64.encodeURI(e) ].join("$");
    }
    function getStrByType(e) {
        const t = getj(e);
        for (const e in t) {
            const r = problems.find(t => t.id === e);
            r && r.meta.s && delete t[e];
        }
        return JSON.stringify(t);
    }
    function exportResultToClipboard(e) {
        return writeToClipboard(generateLink(getStrByType(e)));
    }
    function readFromClipboardFallback() {
        return prompt("请粘贴：", "");
    }
    async function readFromClipboardUnsafe() {
        return navigator.clipboard ? navigator.clipboard.readText() : readFromClipboardFallback();
    }
    async function readFromClipboard() {
        const e = await readFromClipboardUnsafe();
        if (!e.startsWith("djx!")) throw new Error("剪贴板中没有数据，请检查");
        return e.substr(4);
    }
    function writeToClipboardFallback(e) {
        prompt("请复制：", e);
    }
    function writeToClipboard(e) {
        e = "djx!" + e, navigator.clipboard ? navigator.clipboard.writeText(e).then(() => toastr.success("已导出至粘贴板")).catch(e => toastr.error("导出失败")) : writeToClipboardFallback(e);
    }
    function safeDecode(e) {
        try {
            return Base64.decode(e);
        } catch (e) {
            return "";
        }
    }
    async function importResultFromClipboard(e) {
        try {
            const t = await readFromClipboard(), [r, n, i] = t.split("$");
            if (r !== tid) {
                const t = safeDecode(i) || await ajax.pick(r + ".md");
                if (!t) throw new Error("跨卷匹配需要元数据。请选择附加元数据的导出方法");
                const o = JSON.parse(t), a = JSON.parse(safeDecode(n)), s = {};
                for (const e in a) {
                    const t = o[e];
                    if (!t) continue;
                    const r = problems.find(e => e.meta.f === t.f);
                    if (r) if ("t" === r.type) s[r.id] = a[e]; else if ("c" === r.type) {
                        const n = a[e], i = t.o.filter(e => n.includes(e[0])).map(e => e[1]).join("|"), o = r.meta.o.filter(e => i.includes(e[1])).map(e => e[0]).join(",");
                        if (!o) continue;
                        s[r.id] = o;
                    }
                }
                setj(e, s);
            } else sets(e, safeDecode(n));
            toastr.info("导入成功");
        } catch (e) {
            toastr.error("导入错误: " + e.message);
        }
    }
    function exportResultToUbuntuPastebin(e) {
        const t = getj(e) || {}, r = problems.filter(e => !e.meta.s), n = [ `Powered by AnswerSTAR ${pkg.version}, build prod > djx.zhangzisu.cn <`, `问卷编号：${tid} 问卷链接：https://ks.wjx.top/jq/${tid}.aspx 共${r.length}题` ], i = {
            c: "选择题",
            t: "填空题"
        };
        for (const e of r) {
            n.push(""), n.push(""), n.push(`# 题目编号：${e.id} 类型：${i[e.type]}`), n.push(`${e.meta.f}`), 
            n.push("");
            const r = t[e.id] || "";
            if ("c" === e.type) {
                n.push(`# 选择类型：${e.meta.t ? "多选" : "单选"}`);
                for (const t of e.meta.o) n.push(`[${r.includes(t[0]) ? "X" : " "}] 选项编号：${t[0]} => ${t[1]}`);
            } else "t" === e.type && n.push(`=> ${r}`);
        }
        return toastr.info("导出中"), ajax.ubuntuPastebin("AnswerSTAR", "text", n.join("\n"));
    }
    function exportResultAndOpen(e) {
        exportResultToUbuntuPastebin(e).then(e => {
            window.open("https://paste.ubuntu.com/p/" + e), toastr.success("导出成功");
        }).catch(e => {
            toastr.error("导出外链失败：" + e.message);
        });
    }
    function createElementFromHTML(e) {
        var t = document.createElement("div");
        return t.innerHTML = e.trim(), t.firstChild;
    }
    function hookPage() {
        const submitBtn = document.getElementById("submit_button"), bk = submitBtn.onclick;
        submitBtn.onclick = null;
        const validateSkip = () => !gets("bps") && !confirm("确定提交？" + (gets("sm") ? "您已提交" : ""));
        submitBtn.addEventListener("click", e => validateSkip() ? (e.preventDefault(), !1) : bk(e));
        const createSubmit = (e, t) => {
            const r = createElementFromHTML('<input type="button" class="submitbutton" value="' + e + '" onmouseout="this.className=\'submitbutton\';" onmouseover="this.className = \'submitbutton submitbutton_hover\'" style="padding: 0 24px; height: 32px;">');
            return submitBtn.parentElement.appendChild(r), r.addEventListener("click", t), r;
        };
        createSubmit("强制提交", e => {
            if (validateSkip()) return e.preventDefault(), !1;
            wjx.submit(1, !0, void 0, void 0);
        });
        let delayRunning = !1;
        createSubmit("延时提交", ev => {
            if (delayRunning) return void toastr.error("已有延时提交进行");
            const expr = prompt("输入延时提交时间(ms)，支持JS表达式。确保所有空均填，否则提交失败。欲取消请刷新。", "5 * 60 * 1000");
            let time = -1;
            try {
                const result = eval(expr);
                if ("number" != typeof result) throw new Error("非法表达式");
                if (!Number.isSafeInteger(result)) throw new Error("非法数字");
                if (result <= 0) throw new Error("延时必须为正数");
                time = result;
            } catch (e) {
                return void toastr.error(`请检查后重新操作: ${e.message}`);
            }
            delayRunning = !0;
            let cancel = !1;
            toastr.warning("延时提交已启用", "", {
                tapToDismiss: !1,
                timeOut: time,
                closeOnHover: !1,
                progressBar: !0,
                closeButton: !0,
                onHidden: () => {
                    cancel ? toastr.success("延时提交取消") : (toastr.info("开始提交"), wjx.submit(1, !0, void 0, void 0)), 
                    delayRunning = !1;
                },
                onCloseClick: () => {
                    cancel = !0;
                }
            });
        }), createSubmit("高级提交", ev => {
            const expr = prompt("输入提交时上传的开始时间距离提交时间的差值(ms)，支持JS表达式。大概为问卷星显示作答用时多2s", "4000");
            let time = -1;
            try {
                const result = eval(expr);
                if ("number" != typeof result) throw new Error("非法表达式");
                if (!Number.isSafeInteger(result)) throw new Error("非法数字");
                time = result;
            } catch (e) {
                return void toastr.error(`请检查后重新操作: ${e.message}`);
            }
            wjx.submit(1, !0, void 0, Date.now() - time);
        }), document.addEventListener("click", () => {
            probGetAll();
        });
    }
    function diffAns() {
        if (1 === pageType) {
            const e = gets("r");
            lastAns !== e && (lastAns = e, toastr.warning("正确答案更新"), systemNotify("正确答案更新"));
        }
    }
    function updateStatus() {
        if (!statusElem) return;
        const e = e => gets(e) ? "是" : "否", t = problems ? problems.length : 0, r = gets("r") ? Object.keys(getj("r") || {}).length : 0;
        diffAns();
        const n = [ `版本\t: ${pkg.version}\t构建\t: prod`, `题目\t: ${t}\t答案\t: ${r}`, `已经提交\t: ${e("sm")}\t`, `已保存我的答案\t: ${e("s")}`, `禁用自动答案获取\t：${e("nol")}` ];
        statusElem.innerHTML = n.join("\n");
    }
    function createOpenMenuBtn(e) {
        const t = document.createElement("button");
        t.textContent = "menu", t.classList.add("fdd-menu-opener"), document.body.appendChild(t), 
        t.addEventListener("click", e);
    }
    function initUI() {
        const e = document.createElement("div");
        e.classList.add("fdd-menu-container"), document.body.appendChild(e);
        let t = !0;
        return statusElem = function(t) {
            const r = document.createElement(t);
            return e.appendChild(r), r;
        }("pre"), updateStatus(), createOpenMenuBtn(() => {
            t ? (t = !1, e.style.display = "none") : (t = !0, e.style.display = "");
        }), console.log("UI Init"), {
            createBtn: function(t, r) {
                const n = document.createElement("button");
                return n.textContent = t, n.addEventListener("click", r), e.appendChild(n), n;
            },
            createBr: function() {
                const t = document.createElement("br");
                return e.appendChild(t), t;
            }
        };
    }
    async function updateResult() {
        let e;
        try {
            e = await ajax.pick(tid);
        } catch (e) {
            console.log(e);
        }
        e && sets("r", e);
    }
    function qiangbiStr() {
        const e = [ "习卷江胡", "苟利国家", "谈笑风生", "垂死病中", "螳臂当车", "庆丰大帝", "小熊维尼", "州长夫人", "毛病百出", "积恶成习", "无可奉告", "另请高明", "亦可赛艇", "香港记者", "传统艺能", "会堂红歌", "锦城风光", "捌玖陆肆", "图样森破", "身经百战", "改革春风", "借你吉言", "火钳刘明", "影流之主", "蜜汁汉堡", "祖安钢琴", "下次一定", "你币没了", "金色传说", "十连保底", "还有一事", "吉良吉影", "副本零掉", "文艺复兴", "杰哥不要", "光头吴克" ];
        return e[Math.floor(Math.random() * e.length)];
    }
    function getMetaDataStr() {
        const e = {};
        return problems.filter(e => !e.meta.s).forEach(t => {
            e[t.id] = t.meta;
        }), JSON.stringify(e);
    }
    function ksParseTID() {
        const e = /([0-9]+)\.aspx/.exec(location.href);
        tid = e[1];
    }
    function KSInit() {
        window.addEventListener("load", () => {
            setTimeout(() => {
                if (allowCopyPaste(), ksParseTID(), lastAns = gets("r"), showAllOnce(), probParseAll(), 
                utils.deleteAllCookies(), gets("bps")) {
                    const e = getj("bps");
                    if ("hasErr" === e.type) {
                        const r = e.cur.toString();
                        for (const n of problems) "c" === n.type ? 0 === n.meta.t ? c.set(n.elem, r) : c.set(n.elem, [ "1", "2", "3", "4", "1,2", "1,3", "1,4", "2,3", "2,4", "3,4", "1,2,3", "1,2,4", "1,3,4", "2,3,4", "1,2,3,4" ][e.cur]) : "t" === n.type ? t.set(n.elem, qiangbiStr()) : "sl" === n.type ? sl.set(n.elem, "1") : "bi" === n.type && bi.set(n.elem, `${qiangbiStr()},1,20180101`);
                        probSetAll("r", !0);
                    } else if ("onlyScore" === e.type) {
                        for (const e of problems) "c" === e.type ? c.set(e.elem, "1") : "t" === e.type ? t.set(e.elem, qiangbiStr()) : "sl" === e.type ? sl.set(e.elem, "1") : "bi" === e.type && bi.set(e.elem, `${qiangbiStr()},1,20180101`);
                        const r = problems.find(t => t.id === e.arr[e.cur].id);
                        c.set(r.elem, "" + e.pcur);
                    }
                    return probGetAll(), hookPage(), void wjx.submit(1, !0, void 0, Date.now() - 3e4);
                }
                probSetAll("s", !0);
                const {createBtn: e, createBr: r} = initUI();
                e("导入我的答案", () => {
                    importResultFromClipboard("s");
                }), e("导出我的答案", () => {
                    probGetAll(), exportResultToClipboard("s");
                }), e("填入我的答案", () => {
                    probSetAll("s", !0);
                }), r(), e("导入正确答案", () => {
                    importResultFromClipboard("r"), sets("nol", "1");
                }), e("导出正确答案", () => {
                    gets("r") ? exportResultToClipboard("r") : toastr.error("还没有正确答案");
                }), e("填入正确答案", () => {
                    probSetAll("r", !0);
                }), r(), e("删除我的答案", () => {
                    sets("s", "");
                }), e("提示正确答案", () => {
                    probDisplayAll("r");
                }), e("隐藏正确提示", () => {
                    probHideAll();
                }), r(), e("开始自动爆破", async () => {
                    if (toastr.info("刷新正确答案", "", {
                        progressBar: !0
                    }), await updateResult(), !gets("r") || confirm("已经有正确答案了，不要做无谓的牺牲！是否继续？")) {
                        for (const e of problems) "c" === e.type ? c.set(e.elem, "1") : "t" === e.type ? t.set(e.elem, qiangbiStr()) : "sl" === e.type ? sl.set(e.elem, "1") : "bi" === e.type && bi.set(e.elem, `${qiangbiStr()},1,20180101`);
                        confirm("是否继续爆破？") && (setj("bps", {}), wjx.submit(1, !0, void 0, void 0));
                    }
                }), e("开始高级爆破", async () => {
                    if (toastr.info("刷新正确答案", "", {
                        progressBar: !0
                    }), await updateResult(), gets("r") && !confirm("已经有正确答案了，不要做无谓的牺牲！是否继续？")) return;
                    const e = prompt("选择题答案生成(rand|[number])", "1"), r = prompt("填空题答案生成(qiangbi|[text])", "qiangbi"), n = prompt("下拉选择答案生成(rand|[number])", "1");
                    for (const i of problems) "c" === i.type ? "rand" === e ? i.meta.t ? c.set(i.elem, i.meta.o.filter(e => Math.random() < .5).map(e => e[0]).join(",")) : c.set(i.elem, "" + Math.floor(Math.random() * i.meta.o.length) + 1) : c.set(i.elem, e) : "t" === i.type ? t.set(i.elem, "qiangbi" === r ? qiangbiStr() : r) : "sl" === i.type ? sl.set(i.elem, "rand" === n ? "" + Math.floor(Math.random() * i.meta.l) : "1") : "bi" === i.type && bi.set(i.elem, [ ...new Array(i.meta.l) ].map(e => qiangbiStr()).join(","));
                    confirm("是否继续爆破？") && wjx.submit(1, !0);
                }), e("打印完整试卷", () => {
                    print();
                }), r(), e("切换自动答案获取", () => {
                    sets("nol", gets("nol") ? "" : "1");
                }), e("刷新正确答案", () => {
                    sets("r", ""), ajax.pick(tid).then(e => sets("r", e)).catch(e => console.log(e));
                }), e("导出外链", () => {
                    exportResultAndOpen("s");
                }), r();
                const n = e("", () => {
                    i("获取中"), ajax.getIPv4All().then(e => i(e));
                }), i = e => {
                    toastr.info(n.innerText = "IP地址：" + e);
                };
                n.click(), r(), hookPage(), ajax.store(tid + ".md", getMetaDataStr()).then(() => {
                    toastr.success("元数据上传成功");
                }).catch(e => {
                    toastr.error("元数据上传失败");
                });
                const o = async () => {
                    !gets("nol") && await updateResult(), setTimeout(() => {
                        o();
                    }, 5e3);
                };
                o();
            }, 50);
        });
    }
    function jgParseCorrectOne(e) {
        const t = e.parentElement.parentElement.parentElement.getAttribute("topic"), r = problems.find(e => e.id === t);
        if (r) return r.id;
        console.warn("Problem not found: " + t);
    }
    function jgParseCorrect() {
        return [ ...document.querySelectorAll('img[alt="正确"]').values() ].map(e => jgParseCorrectOne(e)).filter(e => e);
    }
    function jgParseFailedOne(e) {
        const t = e.parentElement.parentElement.parentElement, r = t.getAttribute("topic"), n = problems.find(e => e.id === r);
        if (!n) return void console.warn("Problem not found: " + r);
        let i = t.querySelector("div.data__key > div").lastChild;
        if ("DIV" === i.tagName && (i = i.previousSibling), i.tagName) return null;
        const o = i.textContent.trim();
        if ("c" === n.type) {
            const e = n.meta.o.filter(e => o.includes(e[1])).map(e => e[0]).join(",");
            return [ r, e ];
        }
        return "t" === n.type ? [ r, o ] : void 0;
    }
    function jgParseFailed() {
        return [ ...document.querySelectorAll('img[alt="错误"]').values() ].map(e => jgParseFailedOne(e)).filter(e => e);
    }
    function jgRestoreProblems() {
        problems = getj("p");
    }
    function jgParseTid() {
        const e = /q=([0-9]+)/.exec(location.search);
        tid = e[1];
    }
    function JGInit() {
        window.addEventListener("load", () => {
            setTimeout(async () => {
                if (allowCopyPaste(), jgParseTid(), lastAns = gets("r"), jgRestoreProblems(), sets("sm", "1"), 
                gets("bps")) {
                    const e = getj("bps");
                    let t = !1;
                    if (e.type) {
                        if ("hasErr" === e.type) {
                            const r = getj("s"), n = getj("r") || {}, i = jgParseCorrect();
                            for (const e in n) n[e] !== r[e] || i.includes(e) || delete n[e];
                            for (const e of i) n[e] = r[e];
                            const o = jgParseFailed();
                            for (const e of o) n[e[0]] = e[1];
                            setj("r", n), t = problems.filter(e => "c" === e.type && !e.meta.s).every(e => e.id in n), 
                            e.type = "hasErr";
                            const a = problems.filter(e => "c" === e.type && !e.meta.s).map(e => e.meta.t ? 15 : e.meta.o.length).sort((e, t) => t - e)[0];
                            ++e.cur > a && (t = !0);
                        } else if ("onlyScore" === e.type) {
                            const r = parseInt(document.querySelector(".score-form-wrapper > div > div.score-form__details-wrapper > div > div:last-child > div.form__items--rt.figcaption > div > strong").textContent), n = e.arr[e.cur];
                            if (n.ans.push([ getj("s")[n.id], r ]), n.ans.sort((e, t) => t[1] - e[1]), n.ans[0][1] > n.ans[1][1]) {
                                const r = getj("r") || {};
                                r[n.id] = n.ans[0][0], setj("r", r), e.pcur = 2, e.cur++, e.cur === e.arr.length && (t = !0);
                            } else {
                                const r = problems.find(e => e.id === n.id).meta.o.length;
                                ++e.pcur > r && (e.pcur = 2, ++e.cur === e.arr.length && (t = !0));
                            }
                        }
                    } else if (document.getElementById("divAnswer")) {
                        const r = getj("s"), n = getj("r") || {}, i = jgParseCorrect();
                        for (const e in n) n[e] !== r[e] || i.includes(e) || delete n[e];
                        for (const e of i) n[e] = r[e];
                        const o = jgParseFailed();
                        for (const e of o) n[e[0]] = e[1];
                        setj("r", n), t = problems.filter(e => "c" === e.type && !e.meta.s).every(e => e.id in n), 
                        e.type = "hasErr", e.cur = 2;
                    } else {
                        const r = document.querySelector(".score-form-wrapper > div > div.score-form__details-wrapper > div > div:last-child > div.form__items--rt.figcaption > div > strong");
                        if (!r) return sets("bps", ""), void toastr.error("无法爆破");
                        {
                            const n = getj("r") || {}, i = problems.filter(e => "c" === e.type && 0 === e.meta.t && !e.meta.s && !(e.id in n));
                            0 === i.length ? t = !0 : (e.type = "onlyScore", e.arr = i.map(e => ({
                                id: e.id,
                                ans: [ [ "1", parseInt(r.textContent) ] ]
                            })), e.cur = 0, e.pcur = 2);
                        }
                    }
                    return void (t ? (toastr.success("高级爆破成功"), setj("bps", ""), toastr.info("答案及外链上传中", "", {
                        progressBar: !0
                    }), ajax.store(tid, getStrByType("r")).then(() => {
                        toastr.success("答案上传成功");
                    }).catch(e => {
                        toastr.error("答案上传失败");
                    }), exportResultToUbuntuPastebin("r").then(e => ajax.store(tid + ".u", e)).then(() => {
                        toastr.success("外链上传成功");
                    }).catch(e => {
                        console.log(e), toastr.error("外链上传失败");
                    })) : (setj("bps", e), location.href = `https://ks.wjx.top/jq/${tid}.aspx`));
                }
                const {createBtn: e, createBr: t} = initUI();
                if (e("导出我的答案", () => {
                    exportResultToClipboard("s");
                }), e("导出我的答案外链", () => {
                    exportResultAndOpen("s");
                }), document.getElementById("divAnswer")) try {
                    toastr.info("刷新正确答案", "", {
                        progressBar: !0
                    }), await updateResult();
                    const r = getj("s"), n = getj("r") || {}, i = jgParseCorrect();
                    for (const e in n) n[e] !== r[e] || i.includes(e) || delete n[e];
                    for (const e of i) n[e] = r[e];
                    const o = jgParseFailed();
                    for (const e of o) n[e[0]] = e[1];
                    setj("r", n), t(), e("导出正确答案", () => {
                        exportResultToClipboard("r");
                    }), toastr.info("答案及外链上传中", "", {
                        progressBar: !0
                    }), ajax.store(tid, getStrByType("r")).then(() => {
                        toastr.success("答案上传成功");
                    }).catch(e => {
                        toastr.error("答案上传失败");
                    }), exportResultToUbuntuPastebin("r").then(t => (e("导出正确答案外链", () => {
                        window.open("https://paste.ubuntu.com/p/" + t);
                    }), ajax.store(tid + ".u", t))).then(() => {
                        toastr.success("外链上传成功");
                    }).catch(e => {
                        toastr.error("外链上传失败");
                    });
                } catch (e) {
                    console.log(e);
                }
            }, 50);
        });
    }
    switch (redirToDesktop(), redirToSecure(), pageType) {
      case 1:
        KSInit();
        break;

      case 2:
        JGInit();
    }
    document.getElementById("ctl00_lblPowerby") && (document.getElementById("ctl00_lblPowerby").innerHTML = '<a href="https://djx.zhangzisu.cn/" target="_blank" class="link-444" title="答卷星_不止问卷填写/自动考试">答卷星</a>&nbsp;提供技术支持');
}, function(e) {
    e.exports = JSON.parse('{"name":"answerstar","version":"1.5.0","private":true,"scripts":{"build":"gulp build --color","dev":"gulp --color","format":"gulp --color format","version":"yarn build && git add ."},"devDependencies":{"autoprefixer":"^9.7.3","colors":"^1.4.0","css-loader":"^3.2.1","cssnano":"^4.1.10","dotenv":"^8.2.0","eslint":"^6.8.0","eslint-config-standard":"^14.1.0","eslint-plugin-import":"^2.20.1","eslint-plugin-node":"^11.0.0","eslint-plugin-promise":"^4.2.1","eslint-plugin-standard":"^4.0.1","gulp":"^4.0.2","gulp-eslint":"^6.0.0","gulp-run":"^1.7.1","moment":"^2.24.0","postcss-loader":"^3.0.0","to-string-loader":"^1.1.6","url-loader":"^3.0.0","webpack":"^4.41.2","webpack-cli":"^3.3.10"},"license":"MIT","repository":"git@github.com:ZhangZisu/answerstar.git","author":"ZhangZisu <admin@zhangzisu.cn>","description":"最强问卷星助手，答案共享备份，真自动满分，自动提交……","dependencies":{"buffer":"^5.4.3","crypto-browserify":"^3.12.0","dateformat":"^3.0.3","js-base64":"^2.5.2","terser-webpack-plugin":"^2.3.5","toastr":"^2.1.4"}}');
}, function(module, exports, __webpack_require__) {
    (function(global) {
        var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
        !function(e, t) {
            module.exports = t(e);
        }("undefined" != typeof self ? self : "undefined" != typeof window ? window : void 0 !== global ? global : this, (function(global) {
            "use strict";
            global = global || {};
            var _Base64 = global.Base64, version = "2.5.2", buffer;
            if (module.exports) try {
                buffer = eval("require('buffer').Buffer");
            } catch (e) {
                buffer = void 0;
            }
            var b64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", b64tab = function(e) {
                for (var t = {}, r = 0, n = e.length; r < n; r++) t[e.charAt(r)] = r;
                return t;
            }(b64chars), fromCharCode = String.fromCharCode, cb_utob = function(e) {
                if (e.length < 2) return (t = e.charCodeAt(0)) < 128 ? e : t < 2048 ? fromCharCode(192 | t >>> 6) + fromCharCode(128 | 63 & t) : fromCharCode(224 | t >>> 12 & 15) + fromCharCode(128 | t >>> 6 & 63) + fromCharCode(128 | 63 & t);
                var t = 65536 + 1024 * (e.charCodeAt(0) - 55296) + (e.charCodeAt(1) - 56320);
                return fromCharCode(240 | t >>> 18 & 7) + fromCharCode(128 | t >>> 12 & 63) + fromCharCode(128 | t >>> 6 & 63) + fromCharCode(128 | 63 & t);
            }, re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g, utob = function(e) {
                return e.replace(re_utob, cb_utob);
            }, cb_encode = function(e) {
                var t = [ 0, 2, 1 ][e.length % 3], r = e.charCodeAt(0) << 16 | (e.length > 1 ? e.charCodeAt(1) : 0) << 8 | (e.length > 2 ? e.charCodeAt(2) : 0);
                return [ b64chars.charAt(r >>> 18), b64chars.charAt(r >>> 12 & 63), t >= 2 ? "=" : b64chars.charAt(r >>> 6 & 63), t >= 1 ? "=" : b64chars.charAt(63 & r) ].join("");
            }, btoa = global.btoa ? function(e) {
                return global.btoa(e);
            } : function(e) {
                return e.replace(/[\s\S]{1,3}/g, cb_encode);
            }, _encode = function(e) {
                return "[object Uint8Array]" === Object.prototype.toString.call(e) ? e.toString("base64") : btoa(utob(String(e)));
            }, encode = function(e, t) {
                return t ? _encode(String(e)).replace(/[+\/]/g, (function(e) {
                    return "+" == e ? "-" : "_";
                })).replace(/=/g, "") : _encode(e);
            }, encodeURI = function(e) {
                return encode(e, !0);
            }, re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g, cb_btou = function(e) {
                switch (e.length) {
                  case 4:
                    var t = ((7 & e.charCodeAt(0)) << 18 | (63 & e.charCodeAt(1)) << 12 | (63 & e.charCodeAt(2)) << 6 | 63 & e.charCodeAt(3)) - 65536;
                    return fromCharCode(55296 + (t >>> 10)) + fromCharCode(56320 + (1023 & t));

                  case 3:
                    return fromCharCode((15 & e.charCodeAt(0)) << 12 | (63 & e.charCodeAt(1)) << 6 | 63 & e.charCodeAt(2));

                  default:
                    return fromCharCode((31 & e.charCodeAt(0)) << 6 | 63 & e.charCodeAt(1));
                }
            }, btou = function(e) {
                return e.replace(re_btou, cb_btou);
            }, cb_decode = function(e) {
                var t = e.length, r = t % 4, n = (t > 0 ? b64tab[e.charAt(0)] << 18 : 0) | (t > 1 ? b64tab[e.charAt(1)] << 12 : 0) | (t > 2 ? b64tab[e.charAt(2)] << 6 : 0) | (t > 3 ? b64tab[e.charAt(3)] : 0), i = [ fromCharCode(n >>> 16), fromCharCode(n >>> 8 & 255), fromCharCode(255 & n) ];
                return i.length -= [ 0, 0, 2, 1 ][r], i.join("");
            }, _atob = global.atob ? function(e) {
                return global.atob(e);
            } : function(e) {
                return e.replace(/\S{1,4}/g, cb_decode);
            }, atob = function(e) {
                return _atob(String(e).replace(/[^A-Za-z0-9\+\/]/g, ""));
            }, _decode = buffer ? buffer.from && Uint8Array && buffer.from !== Uint8Array.from ? function(e) {
                return (e.constructor === buffer.constructor ? e : buffer.from(e, "base64")).toString();
            } : function(e) {
                return (e.constructor === buffer.constructor ? e : new buffer(e, "base64")).toString();
            } : function(e) {
                return btou(_atob(e));
            }, decode = function(e) {
                return _decode(String(e).replace(/[-_]/g, (function(e) {
                    return "-" == e ? "+" : "/";
                })).replace(/[^A-Za-z0-9\+\/]/g, ""));
            }, noConflict = function() {
                var e = global.Base64;
                return global.Base64 = _Base64, e;
            };
            if (global.Base64 = {
                VERSION: version,
                atob: atob,
                btoa: btoa,
                fromBase64: decode,
                toBase64: encode,
                utob: utob,
                encode: encode,
                encodeURI: encodeURI,
                btou: btou,
                decode: decode,
                noConflict: noConflict,
                __buffer__: buffer
            }, "function" == typeof Object.defineProperty) {
                var noEnum = function(e) {
                    return {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    };
                };
                global.Base64.extendString = function() {
                    Object.defineProperty(String.prototype, "fromBase64", noEnum((function() {
                        return decode(this);
                    }))), Object.defineProperty(String.prototype, "toBase64", noEnum((function(e) {
                        return encode(this, e);
                    }))), Object.defineProperty(String.prototype, "toBase64URI", noEnum((function() {
                        return encode(this, !0);
                    })));
                };
            }
            return global.Meteor && (Base64 = global.Base64), module.exports ? module.exports.Base64 = global.Base64 : (__WEBPACK_AMD_DEFINE_ARRAY__ = [], 
            __WEBPACK_AMD_DEFINE_RESULT__ = function() {
                return global.Base64;
            }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), void 0 === __WEBPACK_AMD_DEFINE_RESULT__ || (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)), 
            {
                Base64: global.Base64
            };
        }));
    }).call(this, __webpack_require__(3));
}, function(e, t) {
    var r;
    r = function() {
        return this;
    }();
    try {
        r = r || new Function("return this")();
    } catch (e) {
        "object" == typeof window && (r = window);
    }
    e.exports = r;
}, function(e, t, r) {
    var n, i;
    r(6), n = [ r(5) ], void 0 === (i = function(e) {
        return function() {
            var t, r, n, i = 0, o = "error", a = "info", s = "success", f = "warning", c = {
                clear: function(r, n) {
                    var i = p();
                    t || u(i), d(r, i, n) || function(r) {
                        for (var n = t.children(), i = n.length - 1; i >= 0; i--) d(e(n[i]), r);
                    }(i);
                },
                remove: function(r) {
                    var n = p();
                    t || u(n), r && 0 === e(":focus", r).length ? b(r) : t.children().length && t.remove();
                },
                error: function(e, t, r) {
                    return l({
                        type: o,
                        iconClass: p().iconClasses.error,
                        message: e,
                        optionsOverride: r,
                        title: t
                    });
                },
                getContainer: u,
                info: function(e, t, r) {
                    return l({
                        type: a,
                        iconClass: p().iconClasses.info,
                        message: e,
                        optionsOverride: r,
                        title: t
                    });
                },
                options: {},
                subscribe: function(e) {
                    r = e;
                },
                success: function(e, t, r) {
                    return l({
                        type: s,
                        iconClass: p().iconClasses.success,
                        message: e,
                        optionsOverride: r,
                        title: t
                    });
                },
                version: "2.1.4",
                warning: function(e, t, r) {
                    return l({
                        type: f,
                        iconClass: p().iconClasses.warning,
                        message: e,
                        optionsOverride: r,
                        title: t
                    });
                }
            };
            return c;
            function u(r, n) {
                return r || (r = p()), (t = e("#" + r.containerId)).length || n && (t = function(r) {
                    return (t = e("<div/>").attr("id", r.containerId).addClass(r.positionClass)).appendTo(e(r.target)), 
                    t;
                }(r)), t;
            }
            function d(t, r, n) {
                var i = !(!n || !n.force) && n.force;
                return !(!t || !i && 0 !== e(":focus", t).length || (t[r.hideMethod]({
                    duration: r.hideDuration,
                    easing: r.hideEasing,
                    complete: function() {
                        b(t);
                    }
                }), 0));
            }
            function h(e) {
                r && r(e);
            }
            function l(r) {
                var o = p(), a = r.iconClass || o.iconClass;
                if (void 0 !== r.optionsOverride && (o = e.extend(o, r.optionsOverride), a = r.optionsOverride.iconClass || a), 
                !function(e, t) {
                    if (e.preventDuplicates) {
                        if (t.message === n) return !0;
                        n = t.message;
                    }
                    return !1;
                }(o, r)) {
                    i++, t = u(o, !0);
                    var s = null, f = e("<div/>"), c = e("<div/>"), d = e("<div/>"), l = e("<div/>"), m = e(o.closeHtml), g = {
                        intervalId: null,
                        hideEta: null,
                        maxHideTime: null
                    }, y = {
                        toastId: i,
                        state: "visible",
                        startTime: new Date,
                        options: o,
                        map: r
                    };
                    return r.iconClass && f.addClass(o.toastClass).addClass(a), function() {
                        if (r.title) {
                            var e = r.title;
                            o.escapeHtml && (e = v(r.title)), c.append(e).addClass(o.titleClass), f.append(c);
                        }
                    }(), function() {
                        if (r.message) {
                            var e = r.message;
                            o.escapeHtml && (e = v(r.message)), d.append(e).addClass(o.messageClass), f.append(d);
                        }
                    }(), o.closeButton && (m.addClass(o.closeClass).attr("role", "button"), f.prepend(m)), 
                    o.progressBar && (l.addClass(o.progressClass), f.prepend(l)), o.rtl && f.addClass("rtl"), 
                    o.newestOnTop ? t.prepend(f) : t.append(f), function() {
                        var e = "";
                        switch (r.iconClass) {
                          case "toast-success":
                          case "toast-info":
                            e = "polite";
                            break;

                          default:
                            e = "assertive";
                        }
                        f.attr("aria-live", e);
                    }(), f.hide(), f[o.showMethod]({
                        duration: o.showDuration,
                        easing: o.showEasing,
                        complete: o.onShown
                    }), o.timeOut > 0 && (s = setTimeout(w, o.timeOut), g.maxHideTime = parseFloat(o.timeOut), 
                    g.hideEta = (new Date).getTime() + g.maxHideTime, o.progressBar && (g.intervalId = setInterval(S, 10))), 
                    o.closeOnHover && f.hover(x, _), !o.onclick && o.tapToDismiss && f.click(w), o.closeButton && m && m.click((function(e) {
                        e.stopPropagation ? e.stopPropagation() : void 0 !== e.cancelBubble && !0 !== e.cancelBubble && (e.cancelBubble = !0), 
                        o.onCloseClick && o.onCloseClick(e), w(!0);
                    })), o.onclick && f.click((function(e) {
                        o.onclick(e), w();
                    })), h(y), o.debug && console && console.log(y), f;
                }
                function v(e) {
                    return null == e && (e = ""), e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                }
                function w(t) {
                    var r = t && !1 !== o.closeMethod ? o.closeMethod : o.hideMethod, n = t && !1 !== o.closeDuration ? o.closeDuration : o.hideDuration, i = t && !1 !== o.closeEasing ? o.closeEasing : o.hideEasing;
                    if (!e(":focus", f).length || t) return clearTimeout(g.intervalId), f[r]({
                        duration: n,
                        easing: i,
                        complete: function() {
                            b(f), clearTimeout(s), o.onHidden && "hidden" !== y.state && o.onHidden(), y.state = "hidden", 
                            y.endTime = new Date, h(y);
                        }
                    });
                }
                function _() {
                    (o.timeOut > 0 || o.extendedTimeOut > 0) && (s = setTimeout(w, o.extendedTimeOut), 
                    g.maxHideTime = parseFloat(o.extendedTimeOut), g.hideEta = (new Date).getTime() + g.maxHideTime);
                }
                function x() {
                    clearTimeout(s), g.hideEta = 0, f.stop(!0, !0)[o.showMethod]({
                        duration: o.showDuration,
                        easing: o.showEasing
                    });
                }
                function S() {
                    var e = (g.hideEta - (new Date).getTime()) / g.maxHideTime * 100;
                    l.width(e + "%");
                }
            }
            function p() {
                return e.extend({}, {
                    tapToDismiss: !0,
                    toastClass: "toast",
                    containerId: "toast-container",
                    debug: !1,
                    showMethod: "fadeIn",
                    showDuration: 300,
                    showEasing: "swing",
                    onShown: void 0,
                    hideMethod: "fadeOut",
                    hideDuration: 1e3,
                    hideEasing: "swing",
                    onHidden: void 0,
                    closeMethod: !1,
                    closeDuration: !1,
                    closeEasing: !1,
                    closeOnHover: !0,
                    extendedTimeOut: 1e3,
                    iconClasses: {
                        error: "toast-error",
                        info: "toast-info",
                        success: "toast-success",
                        warning: "toast-warning"
                    },
                    iconClass: "toast-info",
                    positionClass: "toast-top-right",
                    timeOut: 5e3,
                    titleClass: "toast-title",
                    messageClass: "toast-message",
                    escapeHtml: !1,
                    target: "body",
                    closeHtml: '<button type="button">&times;</button>',
                    closeClass: "toast-close-button",
                    newestOnTop: !0,
                    preventDuplicates: !1,
                    progressBar: !1,
                    progressClass: "toast-progress",
                    rtl: !1
                }, c.options);
            }
            function b(e) {
                t || (t = u()), e.is(":visible") || (e.remove(), e = null, 0 === t.children().length && (t.remove(), 
                n = void 0));
            }
        }();
    }.apply(t, n)) || (e.exports = i);
}, function(e, t, r) {
    var n;
    !function(t, r) {
        "use strict";
        "object" == typeof e.exports ? e.exports = t.document ? r(t, !0) : function(e) {
            if (!e.document) throw new Error("jQuery requires a window with a document");
            return r(e);
        } : r(t);
    }("undefined" != typeof window ? window : this, (function(r, i) {
        "use strict";
        var o = [], a = r.document, s = Object.getPrototypeOf, f = o.slice, c = o.concat, u = o.push, d = o.indexOf, h = {}, l = h.toString, p = h.hasOwnProperty, b = p.toString, m = b.call(Object), g = {}, y = function(e) {
            return "function" == typeof e && "number" != typeof e.nodeType;
        }, v = function(e) {
            return null != e && e === e.window;
        }, w = {
            type: !0,
            src: !0,
            nonce: !0,
            noModule: !0
        };
        function _(e, t, r) {
            var n, i, o = (r = r || a).createElement("script");
            if (o.text = e, t) for (n in w) (i = t[n] || t.getAttribute && t.getAttribute(n)) && o.setAttribute(n, i);
            r.head.appendChild(o).parentNode.removeChild(o);
        }
        function x(e) {
            return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? h[l.call(e)] || "object" : typeof e;
        }
        var S = function(e, t) {
            return new S.fn.init(e, t);
        }, A = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        function E(e) {
            var t = !!e && "length" in e && e.length, r = x(e);
            return !y(e) && !v(e) && ("array" === r || 0 === t || "number" == typeof t && t > 0 && t - 1 in e);
        }
        S.fn = S.prototype = {
            jquery: "3.4.1",
            constructor: S,
            length: 0,
            toArray: function() {
                return f.call(this);
            },
            get: function(e) {
                return null == e ? f.call(this) : e < 0 ? this[e + this.length] : this[e];
            },
            pushStack: function(e) {
                var t = S.merge(this.constructor(), e);
                return t.prevObject = this, t;
            },
            each: function(e) {
                return S.each(this, e);
            },
            map: function(e) {
                return this.pushStack(S.map(this, (function(t, r) {
                    return e.call(t, r, t);
                })));
            },
            slice: function() {
                return this.pushStack(f.apply(this, arguments));
            },
            first: function() {
                return this.eq(0);
            },
            last: function() {
                return this.eq(-1);
            },
            eq: function(e) {
                var t = this.length, r = +e + (e < 0 ? t : 0);
                return this.pushStack(r >= 0 && r < t ? [ this[r] ] : []);
            },
            end: function() {
                return this.prevObject || this.constructor();
            },
            push: u,
            sort: o.sort,
            splice: o.splice
        }, S.extend = S.fn.extend = function() {
            var e, t, r, n, i, o, a = arguments[0] || {}, s = 1, f = arguments.length, c = !1;
            for ("boolean" == typeof a && (c = a, a = arguments[s] || {}, s++), "object" == typeof a || y(a) || (a = {}), 
            s === f && (a = this, s--); s < f; s++) if (null != (e = arguments[s])) for (t in e) n = e[t], 
            "__proto__" !== t && a !== n && (c && n && (S.isPlainObject(n) || (i = Array.isArray(n))) ? (r = a[t], 
            o = i && !Array.isArray(r) ? [] : i || S.isPlainObject(r) ? r : {}, i = !1, a[t] = S.extend(c, o, n)) : void 0 !== n && (a[t] = n));
            return a;
        }, S.extend({
            expando: "jQuery" + ("3.4.1" + Math.random()).replace(/\D/g, ""),
            isReady: !0,
            error: function(e) {
                throw new Error(e);
            },
            noop: function() {},
            isPlainObject: function(e) {
                var t, r;
                return !(!e || "[object Object]" !== l.call(e)) && (!(t = s(e)) || "function" == typeof (r = p.call(t, "constructor") && t.constructor) && b.call(r) === m);
            },
            isEmptyObject: function(e) {
                var t;
                for (t in e) return !1;
                return !0;
            },
            globalEval: function(e, t) {
                _(e, {
                    nonce: t && t.nonce
                });
            },
            each: function(e, t) {
                var r, n = 0;
                if (E(e)) for (r = e.length; n < r && !1 !== t.call(e[n], n, e[n]); n++) ; else for (n in e) if (!1 === t.call(e[n], n, e[n])) break;
                return e;
            },
            trim: function(e) {
                return null == e ? "" : (e + "").replace(A, "");
            },
            makeArray: function(e, t) {
                var r = t || [];
                return null != e && (E(Object(e)) ? S.merge(r, "string" == typeof e ? [ e ] : e) : u.call(r, e)), 
                r;
            },
            inArray: function(e, t, r) {
                return null == t ? -1 : d.call(t, e, r);
            },
            merge: function(e, t) {
                for (var r = +t.length, n = 0, i = e.length; n < r; n++) e[i++] = t[n];
                return e.length = i, e;
            },
            grep: function(e, t, r) {
                for (var n = [], i = 0, o = e.length, a = !r; i < o; i++) !t(e[i], i) !== a && n.push(e[i]);
                return n;
            },
            map: function(e, t, r) {
                var n, i, o = 0, a = [];
                if (E(e)) for (n = e.length; o < n; o++) null != (i = t(e[o], o, r)) && a.push(i); else for (o in e) null != (i = t(e[o], o, r)) && a.push(i);
                return c.apply([], a);
            },
            guid: 1,
            support: g
        }), "function" == typeof Symbol && (S.fn[Symbol.iterator] = o[Symbol.iterator]), 
        S.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), (function(e, t) {
            h["[object " + t + "]"] = t.toLowerCase();
        }));
        var M = function(e) {
            var t, r, n, i, o, a, s, f, c, u, d, h, l, p, b, m, g, y, v, w = "sizzle" + 1 * new Date, _ = e.document, x = 0, S = 0, A = fe(), E = fe(), M = fe(), k = fe(), C = function(e, t) {
                return e === t && (d = !0), 0;
            }, T = {}.hasOwnProperty, I = [], B = I.pop, j = I.push, R = I.push, D = I.slice, P = function(e, t) {
                for (var r = 0, n = e.length; r < n; r++) if (e[r] === t) return r;
                return -1;
            }, q = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", N = "[\\x20\\t\\r\\n\\f]", O = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+", L = "\\[" + N + "*(" + O + ")(?:" + N + "*([*^$|!~]?=)" + N + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + O + "))|)" + N + "*\\]", U = ":(" + O + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + L + ")*)|.*)\\)|)", z = new RegExp(N + "+", "g"), H = new RegExp("^" + N + "+|((?:^|[^\\\\])(?:\\\\.)*)" + N + "+$", "g"), F = new RegExp("^" + N + "*," + N + "*"), W = new RegExp("^" + N + "*([>+~]|" + N + ")" + N + "*"), K = new RegExp(N + "|>"), Y = new RegExp(U), V = new RegExp("^" + O + "$"), J = {
                ID: new RegExp("^#(" + O + ")"),
                CLASS: new RegExp("^\\.(" + O + ")"),
                TAG: new RegExp("^(" + O + "|[*])"),
                ATTR: new RegExp("^" + L),
                PSEUDO: new RegExp("^" + U),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + N + "*(even|odd|(([+-]|)(\\d*)n|)" + N + "*(?:([+-]|)" + N + "*(\\d+)|))" + N + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + q + ")$", "i"),
                needsContext: new RegExp("^" + N + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + N + "*((?:-\\d)?\\d*)" + N + "*\\)|)(?=[^-]|$)", "i")
            }, G = /HTML$/i, X = /^(?:input|select|textarea|button)$/i, $ = /^h\d$/i, Z = /^[^{]+\{\s*\[native \w/, Q = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, ee = /[+~]/, te = new RegExp("\\\\([\\da-f]{1,6}" + N + "?|(" + N + ")|.)", "ig"), re = function(e, t, r) {
                var n = "0x" + t - 65536;
                return n != n || r ? t : n < 0 ? String.fromCharCode(n + 65536) : String.fromCharCode(n >> 10 | 55296, 1023 & n | 56320);
            }, ne = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, ie = function(e, t) {
                return t ? "\0" === e ? "�" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e;
            }, oe = function() {
                h();
            }, ae = we((function(e) {
                return !0 === e.disabled && "fieldset" === e.nodeName.toLowerCase();
            }), {
                dir: "parentNode",
                next: "legend"
            });
            try {
                R.apply(I = D.call(_.childNodes), _.childNodes), I[_.childNodes.length].nodeType;
            } catch (e) {
                R = {
                    apply: I.length ? function(e, t) {
                        j.apply(e, D.call(t));
                    } : function(e, t) {
                        for (var r = e.length, n = 0; e[r++] = t[n++]; ) ;
                        e.length = r - 1;
                    }
                };
            }
            function se(e, t, n, i) {
                var o, s, c, u, d, p, g, y = t && t.ownerDocument, x = t ? t.nodeType : 9;
                if (n = n || [], "string" != typeof e || !e || 1 !== x && 9 !== x && 11 !== x) return n;
                if (!i && ((t ? t.ownerDocument || t : _) !== l && h(t), t = t || l, b)) {
                    if (11 !== x && (d = Q.exec(e))) if (o = d[1]) {
                        if (9 === x) {
                            if (!(c = t.getElementById(o))) return n;
                            if (c.id === o) return n.push(c), n;
                        } else if (y && (c = y.getElementById(o)) && v(t, c) && c.id === o) return n.push(c), 
                        n;
                    } else {
                        if (d[2]) return R.apply(n, t.getElementsByTagName(e)), n;
                        if ((o = d[3]) && r.getElementsByClassName && t.getElementsByClassName) return R.apply(n, t.getElementsByClassName(o)), 
                        n;
                    }
                    if (r.qsa && !k[e + " "] && (!m || !m.test(e)) && (1 !== x || "object" !== t.nodeName.toLowerCase())) {
                        if (g = e, y = t, 1 === x && K.test(e)) {
                            for ((u = t.getAttribute("id")) ? u = u.replace(ne, ie) : t.setAttribute("id", u = w), 
                            s = (p = a(e)).length; s--; ) p[s] = "#" + u + " " + ve(p[s]);
                            g = p.join(","), y = ee.test(e) && ge(t.parentNode) || t;
                        }
                        try {
                            return R.apply(n, y.querySelectorAll(g)), n;
                        } catch (t) {
                            k(e, !0);
                        } finally {
                            u === w && t.removeAttribute("id");
                        }
                    }
                }
                return f(e.replace(H, "$1"), t, n, i);
            }
            function fe() {
                var e = [];
                return function t(r, i) {
                    return e.push(r + " ") > n.cacheLength && delete t[e.shift()], t[r + " "] = i;
                };
            }
            function ce(e) {
                return e[w] = !0, e;
            }
            function ue(e) {
                var t = l.createElement("fieldset");
                try {
                    return !!e(t);
                } catch (e) {
                    return !1;
                } finally {
                    t.parentNode && t.parentNode.removeChild(t), t = null;
                }
            }
            function de(e, t) {
                for (var r = e.split("|"), i = r.length; i--; ) n.attrHandle[r[i]] = t;
            }
            function he(e, t) {
                var r = t && e, n = r && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
                if (n) return n;
                if (r) for (;r = r.nextSibling; ) if (r === t) return -1;
                return e ? 1 : -1;
            }
            function le(e) {
                return function(t) {
                    return "input" === t.nodeName.toLowerCase() && t.type === e;
                };
            }
            function pe(e) {
                return function(t) {
                    var r = t.nodeName.toLowerCase();
                    return ("input" === r || "button" === r) && t.type === e;
                };
            }
            function be(e) {
                return function(t) {
                    return "form" in t ? t.parentNode && !1 === t.disabled ? "label" in t ? "label" in t.parentNode ? t.parentNode.disabled === e : t.disabled === e : t.isDisabled === e || t.isDisabled !== !e && ae(t) === e : t.disabled === e : "label" in t && t.disabled === e;
                };
            }
            function me(e) {
                return ce((function(t) {
                    return t = +t, ce((function(r, n) {
                        for (var i, o = e([], r.length, t), a = o.length; a--; ) r[i = o[a]] && (r[i] = !(n[i] = r[i]));
                    }));
                }));
            }
            function ge(e) {
                return e && void 0 !== e.getElementsByTagName && e;
            }
            for (t in r = se.support = {}, o = se.isXML = function(e) {
                var t = e.namespaceURI, r = (e.ownerDocument || e).documentElement;
                return !G.test(t || r && r.nodeName || "HTML");
            }, h = se.setDocument = function(e) {
                var t, i, a = e ? e.ownerDocument || e : _;
                return a !== l && 9 === a.nodeType && a.documentElement ? (p = (l = a).documentElement, 
                b = !o(l), _ !== l && (i = l.defaultView) && i.top !== i && (i.addEventListener ? i.addEventListener("unload", oe, !1) : i.attachEvent && i.attachEvent("onunload", oe)), 
                r.attributes = ue((function(e) {
                    return e.className = "i", !e.getAttribute("className");
                })), r.getElementsByTagName = ue((function(e) {
                    return e.appendChild(l.createComment("")), !e.getElementsByTagName("*").length;
                })), r.getElementsByClassName = Z.test(l.getElementsByClassName), r.getById = ue((function(e) {
                    return p.appendChild(e).id = w, !l.getElementsByName || !l.getElementsByName(w).length;
                })), r.getById ? (n.filter.ID = function(e) {
                    var t = e.replace(te, re);
                    return function(e) {
                        return e.getAttribute("id") === t;
                    };
                }, n.find.ID = function(e, t) {
                    if (void 0 !== t.getElementById && b) {
                        var r = t.getElementById(e);
                        return r ? [ r ] : [];
                    }
                }) : (n.filter.ID = function(e) {
                    var t = e.replace(te, re);
                    return function(e) {
                        var r = void 0 !== e.getAttributeNode && e.getAttributeNode("id");
                        return r && r.value === t;
                    };
                }, n.find.ID = function(e, t) {
                    if (void 0 !== t.getElementById && b) {
                        var r, n, i, o = t.getElementById(e);
                        if (o) {
                            if ((r = o.getAttributeNode("id")) && r.value === e) return [ o ];
                            for (i = t.getElementsByName(e), n = 0; o = i[n++]; ) if ((r = o.getAttributeNode("id")) && r.value === e) return [ o ];
                        }
                        return [];
                    }
                }), n.find.TAG = r.getElementsByTagName ? function(e, t) {
                    return void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e) : r.qsa ? t.querySelectorAll(e) : void 0;
                } : function(e, t) {
                    var r, n = [], i = 0, o = t.getElementsByTagName(e);
                    if ("*" === e) {
                        for (;r = o[i++]; ) 1 === r.nodeType && n.push(r);
                        return n;
                    }
                    return o;
                }, n.find.CLASS = r.getElementsByClassName && function(e, t) {
                    if (void 0 !== t.getElementsByClassName && b) return t.getElementsByClassName(e);
                }, g = [], m = [], (r.qsa = Z.test(l.querySelectorAll)) && (ue((function(e) {
                    p.appendChild(e).innerHTML = "<a id='" + w + "'></a><select id='" + w + "-\r\\' msallowcapture=''><option selected=''></option></select>", 
                    e.querySelectorAll("[msallowcapture^='']").length && m.push("[*^$]=" + N + "*(?:''|\"\")"), 
                    e.querySelectorAll("[selected]").length || m.push("\\[" + N + "*(?:value|" + q + ")"), 
                    e.querySelectorAll("[id~=" + w + "-]").length || m.push("~="), e.querySelectorAll(":checked").length || m.push(":checked"), 
                    e.querySelectorAll("a#" + w + "+*").length || m.push(".#.+[+~]");
                })), ue((function(e) {
                    e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                    var t = l.createElement("input");
                    t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && m.push("name" + N + "*[*^$|!~]?="), 
                    2 !== e.querySelectorAll(":enabled").length && m.push(":enabled", ":disabled"), 
                    p.appendChild(e).disabled = !0, 2 !== e.querySelectorAll(":disabled").length && m.push(":enabled", ":disabled"), 
                    e.querySelectorAll("*,:x"), m.push(",.*:");
                }))), (r.matchesSelector = Z.test(y = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.oMatchesSelector || p.msMatchesSelector)) && ue((function(e) {
                    r.disconnectedMatch = y.call(e, "*"), y.call(e, "[s!='']:x"), g.push("!=", U);
                })), m = m.length && new RegExp(m.join("|")), g = g.length && new RegExp(g.join("|")), 
                t = Z.test(p.compareDocumentPosition), v = t || Z.test(p.contains) ? function(e, t) {
                    var r = 9 === e.nodeType ? e.documentElement : e, n = t && t.parentNode;
                    return e === n || !(!n || 1 !== n.nodeType || !(r.contains ? r.contains(n) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(n)));
                } : function(e, t) {
                    if (t) for (;t = t.parentNode; ) if (t === e) return !0;
                    return !1;
                }, C = t ? function(e, t) {
                    if (e === t) return d = !0, 0;
                    var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                    return n || (1 & (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !r.sortDetached && t.compareDocumentPosition(e) === n ? e === l || e.ownerDocument === _ && v(_, e) ? -1 : t === l || t.ownerDocument === _ && v(_, t) ? 1 : u ? P(u, e) - P(u, t) : 0 : 4 & n ? -1 : 1);
                } : function(e, t) {
                    if (e === t) return d = !0, 0;
                    var r, n = 0, i = e.parentNode, o = t.parentNode, a = [ e ], s = [ t ];
                    if (!i || !o) return e === l ? -1 : t === l ? 1 : i ? -1 : o ? 1 : u ? P(u, e) - P(u, t) : 0;
                    if (i === o) return he(e, t);
                    for (r = e; r = r.parentNode; ) a.unshift(r);
                    for (r = t; r = r.parentNode; ) s.unshift(r);
                    for (;a[n] === s[n]; ) n++;
                    return n ? he(a[n], s[n]) : a[n] === _ ? -1 : s[n] === _ ? 1 : 0;
                }, l) : l;
            }, se.matches = function(e, t) {
                return se(e, null, null, t);
            }, se.matchesSelector = function(e, t) {
                if ((e.ownerDocument || e) !== l && h(e), r.matchesSelector && b && !k[t + " "] && (!g || !g.test(t)) && (!m || !m.test(t))) try {
                    var n = y.call(e, t);
                    if (n || r.disconnectedMatch || e.document && 11 !== e.document.nodeType) return n;
                } catch (e) {
                    k(t, !0);
                }
                return se(t, l, null, [ e ]).length > 0;
            }, se.contains = function(e, t) {
                return (e.ownerDocument || e) !== l && h(e), v(e, t);
            }, se.attr = function(e, t) {
                (e.ownerDocument || e) !== l && h(e);
                var i = n.attrHandle[t.toLowerCase()], o = i && T.call(n.attrHandle, t.toLowerCase()) ? i(e, t, !b) : void 0;
                return void 0 !== o ? o : r.attributes || !b ? e.getAttribute(t) : (o = e.getAttributeNode(t)) && o.specified ? o.value : null;
            }, se.escape = function(e) {
                return (e + "").replace(ne, ie);
            }, se.error = function(e) {
                throw new Error("Syntax error, unrecognized expression: " + e);
            }, se.uniqueSort = function(e) {
                var t, n = [], i = 0, o = 0;
                if (d = !r.detectDuplicates, u = !r.sortStable && e.slice(0), e.sort(C), d) {
                    for (;t = e[o++]; ) t === e[o] && (i = n.push(o));
                    for (;i--; ) e.splice(n[i], 1);
                }
                return u = null, e;
            }, i = se.getText = function(e) {
                var t, r = "", n = 0, o = e.nodeType;
                if (o) {
                    if (1 === o || 9 === o || 11 === o) {
                        if ("string" == typeof e.textContent) return e.textContent;
                        for (e = e.firstChild; e; e = e.nextSibling) r += i(e);
                    } else if (3 === o || 4 === o) return e.nodeValue;
                } else for (;t = e[n++]; ) r += i(t);
                return r;
            }, (n = se.selectors = {
                cacheLength: 50,
                createPseudo: ce,
                match: J,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(e) {
                        return e[1] = e[1].replace(te, re), e[3] = (e[3] || e[4] || e[5] || "").replace(te, re), 
                        "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4);
                    },
                    CHILD: function(e) {
                        return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || se.error(e[0]), 
                        e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && se.error(e[0]), 
                        e;
                    },
                    PSEUDO: function(e) {
                        var t, r = !e[6] && e[2];
                        return J.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : r && Y.test(r) && (t = a(r, !0)) && (t = r.indexOf(")", r.length - t) - r.length) && (e[0] = e[0].slice(0, t), 
                        e[2] = r.slice(0, t)), e.slice(0, 3));
                    }
                },
                filter: {
                    TAG: function(e) {
                        var t = e.replace(te, re).toLowerCase();
                        return "*" === e ? function() {
                            return !0;
                        } : function(e) {
                            return e.nodeName && e.nodeName.toLowerCase() === t;
                        };
                    },
                    CLASS: function(e) {
                        var t = A[e + " "];
                        return t || (t = new RegExp("(^|" + N + ")" + e + "(" + N + "|$)")) && A(e, (function(e) {
                            return t.test("string" == typeof e.className && e.className || void 0 !== e.getAttribute && e.getAttribute("class") || "");
                        }));
                    },
                    ATTR: function(e, t, r) {
                        return function(n) {
                            var i = se.attr(n, e);
                            return null == i ? "!=" === t : !t || (i += "", "=" === t ? i === r : "!=" === t ? i !== r : "^=" === t ? r && 0 === i.indexOf(r) : "*=" === t ? r && i.indexOf(r) > -1 : "$=" === t ? r && i.slice(-r.length) === r : "~=" === t ? (" " + i.replace(z, " ") + " ").indexOf(r) > -1 : "|=" === t && (i === r || i.slice(0, r.length + 1) === r + "-"));
                        };
                    },
                    CHILD: function(e, t, r, n, i) {
                        var o = "nth" !== e.slice(0, 3), a = "last" !== e.slice(-4), s = "of-type" === t;
                        return 1 === n && 0 === i ? function(e) {
                            return !!e.parentNode;
                        } : function(t, r, f) {
                            var c, u, d, h, l, p, b = o !== a ? "nextSibling" : "previousSibling", m = t.parentNode, g = s && t.nodeName.toLowerCase(), y = !f && !s, v = !1;
                            if (m) {
                                if (o) {
                                    for (;b; ) {
                                        for (h = t; h = h[b]; ) if (s ? h.nodeName.toLowerCase() === g : 1 === h.nodeType) return !1;
                                        p = b = "only" === e && !p && "nextSibling";
                                    }
                                    return !0;
                                }
                                if (p = [ a ? m.firstChild : m.lastChild ], a && y) {
                                    for (v = (l = (c = (u = (d = (h = m)[w] || (h[w] = {}))[h.uniqueID] || (d[h.uniqueID] = {}))[e] || [])[0] === x && c[1]) && c[2], 
                                    h = l && m.childNodes[l]; h = ++l && h && h[b] || (v = l = 0) || p.pop(); ) if (1 === h.nodeType && ++v && h === t) {
                                        u[e] = [ x, l, v ];
                                        break;
                                    }
                                } else if (y && (v = l = (c = (u = (d = (h = t)[w] || (h[w] = {}))[h.uniqueID] || (d[h.uniqueID] = {}))[e] || [])[0] === x && c[1]), 
                                !1 === v) for (;(h = ++l && h && h[b] || (v = l = 0) || p.pop()) && ((s ? h.nodeName.toLowerCase() !== g : 1 !== h.nodeType) || !++v || (y && ((u = (d = h[w] || (h[w] = {}))[h.uniqueID] || (d[h.uniqueID] = {}))[e] = [ x, v ]), 
                                h !== t)); ) ;
                                return (v -= i) === n || v % n == 0 && v / n >= 0;
                            }
                        };
                    },
                    PSEUDO: function(e, t) {
                        var r, i = n.pseudos[e] || n.setFilters[e.toLowerCase()] || se.error("unsupported pseudo: " + e);
                        return i[w] ? i(t) : i.length > 1 ? (r = [ e, e, "", t ], n.setFilters.hasOwnProperty(e.toLowerCase()) ? ce((function(e, r) {
                            for (var n, o = i(e, t), a = o.length; a--; ) e[n = P(e, o[a])] = !(r[n] = o[a]);
                        })) : function(e) {
                            return i(e, 0, r);
                        }) : i;
                    }
                },
                pseudos: {
                    not: ce((function(e) {
                        var t = [], r = [], n = s(e.replace(H, "$1"));
                        return n[w] ? ce((function(e, t, r, i) {
                            for (var o, a = n(e, null, i, []), s = e.length; s--; ) (o = a[s]) && (e[s] = !(t[s] = o));
                        })) : function(e, i, o) {
                            return t[0] = e, n(t, null, o, r), t[0] = null, !r.pop();
                        };
                    })),
                    has: ce((function(e) {
                        return function(t) {
                            return se(e, t).length > 0;
                        };
                    })),
                    contains: ce((function(e) {
                        return e = e.replace(te, re), function(t) {
                            return (t.textContent || i(t)).indexOf(e) > -1;
                        };
                    })),
                    lang: ce((function(e) {
                        return V.test(e || "") || se.error("unsupported lang: " + e), e = e.replace(te, re).toLowerCase(), 
                        function(t) {
                            var r;
                            do {
                                if (r = b ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return (r = r.toLowerCase()) === e || 0 === r.indexOf(e + "-");
                            } while ((t = t.parentNode) && 1 === t.nodeType);
                            return !1;
                        };
                    })),
                    target: function(t) {
                        var r = e.location && e.location.hash;
                        return r && r.slice(1) === t.id;
                    },
                    root: function(e) {
                        return e === p;
                    },
                    focus: function(e) {
                        return e === l.activeElement && (!l.hasFocus || l.hasFocus()) && !!(e.type || e.href || ~e.tabIndex);
                    },
                    enabled: be(!1),
                    disabled: be(!0),
                    checked: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && !!e.checked || "option" === t && !!e.selected;
                    },
                    selected: function(e) {
                        return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected;
                    },
                    empty: function(e) {
                        for (e = e.firstChild; e; e = e.nextSibling) if (e.nodeType < 6) return !1;
                        return !0;
                    },
                    parent: function(e) {
                        return !n.pseudos.empty(e);
                    },
                    header: function(e) {
                        return $.test(e.nodeName);
                    },
                    input: function(e) {
                        return X.test(e.nodeName);
                    },
                    button: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && "button" === e.type || "button" === t;
                    },
                    text: function(e) {
                        var t;
                        return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase());
                    },
                    first: me((function() {
                        return [ 0 ];
                    })),
                    last: me((function(e, t) {
                        return [ t - 1 ];
                    })),
                    eq: me((function(e, t, r) {
                        return [ r < 0 ? r + t : r ];
                    })),
                    even: me((function(e, t) {
                        for (var r = 0; r < t; r += 2) e.push(r);
                        return e;
                    })),
                    odd: me((function(e, t) {
                        for (var r = 1; r < t; r += 2) e.push(r);
                        return e;
                    })),
                    lt: me((function(e, t, r) {
                        for (var n = r < 0 ? r + t : r > t ? t : r; --n >= 0; ) e.push(n);
                        return e;
                    })),
                    gt: me((function(e, t, r) {
                        for (var n = r < 0 ? r + t : r; ++n < t; ) e.push(n);
                        return e;
                    }))
                }
            }).pseudos.nth = n.pseudos.eq, {
                radio: !0,
                checkbox: !0,
                file: !0,
                password: !0,
                image: !0
            }) n.pseudos[t] = le(t);
            for (t in {
                submit: !0,
                reset: !0
            }) n.pseudos[t] = pe(t);
            function ye() {}
            function ve(e) {
                for (var t = 0, r = e.length, n = ""; t < r; t++) n += e[t].value;
                return n;
            }
            function we(e, t, r) {
                var n = t.dir, i = t.next, o = i || n, a = r && "parentNode" === o, s = S++;
                return t.first ? function(t, r, i) {
                    for (;t = t[n]; ) if (1 === t.nodeType || a) return e(t, r, i);
                    return !1;
                } : function(t, r, f) {
                    var c, u, d, h = [ x, s ];
                    if (f) {
                        for (;t = t[n]; ) if ((1 === t.nodeType || a) && e(t, r, f)) return !0;
                    } else for (;t = t[n]; ) if (1 === t.nodeType || a) if (u = (d = t[w] || (t[w] = {}))[t.uniqueID] || (d[t.uniqueID] = {}), 
                    i && i === t.nodeName.toLowerCase()) t = t[n] || t; else {
                        if ((c = u[o]) && c[0] === x && c[1] === s) return h[2] = c[2];
                        if (u[o] = h, h[2] = e(t, r, f)) return !0;
                    }
                    return !1;
                };
            }
            function _e(e) {
                return e.length > 1 ? function(t, r, n) {
                    for (var i = e.length; i--; ) if (!e[i](t, r, n)) return !1;
                    return !0;
                } : e[0];
            }
            function xe(e, t, r, n, i) {
                for (var o, a = [], s = 0, f = e.length, c = null != t; s < f; s++) (o = e[s]) && (r && !r(o, n, i) || (a.push(o), 
                c && t.push(s)));
                return a;
            }
            function Se(e, t, r, n, i, o) {
                return n && !n[w] && (n = Se(n)), i && !i[w] && (i = Se(i, o)), ce((function(o, a, s, f) {
                    var c, u, d, h = [], l = [], p = a.length, b = o || function(e, t, r) {
                        for (var n = 0, i = t.length; n < i; n++) se(e, t[n], r);
                        return r;
                    }(t || "*", s.nodeType ? [ s ] : s, []), m = !e || !o && t ? b : xe(b, h, e, s, f), g = r ? i || (o ? e : p || n) ? [] : a : m;
                    if (r && r(m, g, s, f), n) for (c = xe(g, l), n(c, [], s, f), u = c.length; u--; ) (d = c[u]) && (g[l[u]] = !(m[l[u]] = d));
                    if (o) {
                        if (i || e) {
                            if (i) {
                                for (c = [], u = g.length; u--; ) (d = g[u]) && c.push(m[u] = d);
                                i(null, g = [], c, f);
                            }
                            for (u = g.length; u--; ) (d = g[u]) && (c = i ? P(o, d) : h[u]) > -1 && (o[c] = !(a[c] = d));
                        }
                    } else g = xe(g === a ? g.splice(p, g.length) : g), i ? i(null, a, g, f) : R.apply(a, g);
                }));
            }
            function Ae(e) {
                for (var t, r, i, o = e.length, a = n.relative[e[0].type], s = a || n.relative[" "], f = a ? 1 : 0, u = we((function(e) {
                    return e === t;
                }), s, !0), d = we((function(e) {
                    return P(t, e) > -1;
                }), s, !0), h = [ function(e, r, n) {
                    var i = !a && (n || r !== c) || ((t = r).nodeType ? u(e, r, n) : d(e, r, n));
                    return t = null, i;
                } ]; f < o; f++) if (r = n.relative[e[f].type]) h = [ we(_e(h), r) ]; else {
                    if ((r = n.filter[e[f].type].apply(null, e[f].matches))[w]) {
                        for (i = ++f; i < o && !n.relative[e[i].type]; i++) ;
                        return Se(f > 1 && _e(h), f > 1 && ve(e.slice(0, f - 1).concat({
                            value: " " === e[f - 2].type ? "*" : ""
                        })).replace(H, "$1"), r, f < i && Ae(e.slice(f, i)), i < o && Ae(e = e.slice(i)), i < o && ve(e));
                    }
                    h.push(r);
                }
                return _e(h);
            }
            return ye.prototype = n.filters = n.pseudos, n.setFilters = new ye, a = se.tokenize = function(e, t) {
                var r, i, o, a, s, f, c, u = E[e + " "];
                if (u) return t ? 0 : u.slice(0);
                for (s = e, f = [], c = n.preFilter; s; ) {
                    for (a in r && !(i = F.exec(s)) || (i && (s = s.slice(i[0].length) || s), f.push(o = [])), 
                    r = !1, (i = W.exec(s)) && (r = i.shift(), o.push({
                        value: r,
                        type: i[0].replace(H, " ")
                    }), s = s.slice(r.length)), n.filter) !(i = J[a].exec(s)) || c[a] && !(i = c[a](i)) || (r = i.shift(), 
                    o.push({
                        value: r,
                        type: a,
                        matches: i
                    }), s = s.slice(r.length));
                    if (!r) break;
                }
                return t ? s.length : s ? se.error(e) : E(e, f).slice(0);
            }, s = se.compile = function(e, t) {
                var r, i = [], o = [], s = M[e + " "];
                if (!s) {
                    for (t || (t = a(e)), r = t.length; r--; ) (s = Ae(t[r]))[w] ? i.push(s) : o.push(s);
                    (s = M(e, function(e, t) {
                        var r = t.length > 0, i = e.length > 0, o = function(o, a, s, f, u) {
                            var d, p, m, g = 0, y = "0", v = o && [], w = [], _ = c, S = o || i && n.find.TAG("*", u), A = x += null == _ ? 1 : Math.random() || .1, E = S.length;
                            for (u && (c = a === l || a || u); y !== E && null != (d = S[y]); y++) {
                                if (i && d) {
                                    for (p = 0, a || d.ownerDocument === l || (h(d), s = !b); m = e[p++]; ) if (m(d, a || l, s)) {
                                        f.push(d);
                                        break;
                                    }
                                    u && (x = A);
                                }
                                r && ((d = !m && d) && g--, o && v.push(d));
                            }
                            if (g += y, r && y !== g) {
                                for (p = 0; m = t[p++]; ) m(v, w, a, s);
                                if (o) {
                                    if (g > 0) for (;y--; ) v[y] || w[y] || (w[y] = B.call(f));
                                    w = xe(w);
                                }
                                R.apply(f, w), u && !o && w.length > 0 && g + t.length > 1 && se.uniqueSort(f);
                            }
                            return u && (x = A, c = _), v;
                        };
                        return r ? ce(o) : o;
                    }(o, i))).selector = e;
                }
                return s;
            }, f = se.select = function(e, t, r, i) {
                var o, f, c, u, d, h = "function" == typeof e && e, l = !i && a(e = h.selector || e);
                if (r = r || [], 1 === l.length) {
                    if ((f = l[0] = l[0].slice(0)).length > 2 && "ID" === (c = f[0]).type && 9 === t.nodeType && b && n.relative[f[1].type]) {
                        if (!(t = (n.find.ID(c.matches[0].replace(te, re), t) || [])[0])) return r;
                        h && (t = t.parentNode), e = e.slice(f.shift().value.length);
                    }
                    for (o = J.needsContext.test(e) ? 0 : f.length; o-- && (c = f[o], !n.relative[u = c.type]); ) if ((d = n.find[u]) && (i = d(c.matches[0].replace(te, re), ee.test(f[0].type) && ge(t.parentNode) || t))) {
                        if (f.splice(o, 1), !(e = i.length && ve(f))) return R.apply(r, i), r;
                        break;
                    }
                }
                return (h || s(e, l))(i, t, !b, r, !t || ee.test(e) && ge(t.parentNode) || t), r;
            }, r.sortStable = w.split("").sort(C).join("") === w, r.detectDuplicates = !!d, 
            h(), r.sortDetached = ue((function(e) {
                return 1 & e.compareDocumentPosition(l.createElement("fieldset"));
            })), ue((function(e) {
                return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href");
            })) || de("type|href|height|width", (function(e, t, r) {
                if (!r) return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2);
            })), r.attributes && ue((function(e) {
                return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value");
            })) || de("value", (function(e, t, r) {
                if (!r && "input" === e.nodeName.toLowerCase()) return e.defaultValue;
            })), ue((function(e) {
                return null == e.getAttribute("disabled");
            })) || de(q, (function(e, t, r) {
                var n;
                if (!r) return !0 === e[t] ? t.toLowerCase() : (n = e.getAttributeNode(t)) && n.specified ? n.value : null;
            })), se;
        }(r);
        S.find = M, S.expr = M.selectors, S.expr[":"] = S.expr.pseudos, S.uniqueSort = S.unique = M.uniqueSort, 
        S.text = M.getText, S.isXMLDoc = M.isXML, S.contains = M.contains, S.escapeSelector = M.escape;
        var k = function(e, t, r) {
            for (var n = [], i = void 0 !== r; (e = e[t]) && 9 !== e.nodeType; ) if (1 === e.nodeType) {
                if (i && S(e).is(r)) break;
                n.push(e);
            }
            return n;
        }, C = function(e, t) {
            for (var r = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && r.push(e);
            return r;
        }, T = S.expr.match.needsContext;
        function I(e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase();
        }
        var B = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
        function j(e, t, r) {
            return y(t) ? S.grep(e, (function(e, n) {
                return !!t.call(e, n, e) !== r;
            })) : t.nodeType ? S.grep(e, (function(e) {
                return e === t !== r;
            })) : "string" != typeof t ? S.grep(e, (function(e) {
                return d.call(t, e) > -1 !== r;
            })) : S.filter(t, e, r);
        }
        S.filter = function(e, t, r) {
            var n = t[0];
            return r && (e = ":not(" + e + ")"), 1 === t.length && 1 === n.nodeType ? S.find.matchesSelector(n, e) ? [ n ] : [] : S.find.matches(e, S.grep(t, (function(e) {
                return 1 === e.nodeType;
            })));
        }, S.fn.extend({
            find: function(e) {
                var t, r, n = this.length, i = this;
                if ("string" != typeof e) return this.pushStack(S(e).filter((function() {
                    for (t = 0; t < n; t++) if (S.contains(i[t], this)) return !0;
                })));
                for (r = this.pushStack([]), t = 0; t < n; t++) S.find(e, i[t], r);
                return n > 1 ? S.uniqueSort(r) : r;
            },
            filter: function(e) {
                return this.pushStack(j(this, e || [], !1));
            },
            not: function(e) {
                return this.pushStack(j(this, e || [], !0));
            },
            is: function(e) {
                return !!j(this, "string" == typeof e && T.test(e) ? S(e) : e || [], !1).length;
            }
        });
        var R, D = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
        (S.fn.init = function(e, t, r) {
            var n, i;
            if (!e) return this;
            if (r = r || R, "string" == typeof e) {
                if (!(n = "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3 ? [ null, e, null ] : D.exec(e)) || !n[1] && t) return !t || t.jquery ? (t || r).find(e) : this.constructor(t).find(e);
                if (n[1]) {
                    if (t = t instanceof S ? t[0] : t, S.merge(this, S.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : a, !0)), 
                    B.test(n[1]) && S.isPlainObject(t)) for (n in t) y(this[n]) ? this[n](t[n]) : this.attr(n, t[n]);
                    return this;
                }
                return (i = a.getElementById(n[2])) && (this[0] = i, this.length = 1), this;
            }
            return e.nodeType ? (this[0] = e, this.length = 1, this) : y(e) ? void 0 !== r.ready ? r.ready(e) : e(S) : S.makeArray(e, this);
        }).prototype = S.fn, R = S(a);
        var P = /^(?:parents|prev(?:Until|All))/, q = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
        function N(e, t) {
            for (;(e = e[t]) && 1 !== e.nodeType; ) ;
            return e;
        }
        S.fn.extend({
            has: function(e) {
                var t = S(e, this), r = t.length;
                return this.filter((function() {
                    for (var e = 0; e < r; e++) if (S.contains(this, t[e])) return !0;
                }));
            },
            closest: function(e, t) {
                var r, n = 0, i = this.length, o = [], a = "string" != typeof e && S(e);
                if (!T.test(e)) for (;n < i; n++) for (r = this[n]; r && r !== t; r = r.parentNode) if (r.nodeType < 11 && (a ? a.index(r) > -1 : 1 === r.nodeType && S.find.matchesSelector(r, e))) {
                    o.push(r);
                    break;
                }
                return this.pushStack(o.length > 1 ? S.uniqueSort(o) : o);
            },
            index: function(e) {
                return e ? "string" == typeof e ? d.call(S(e), this[0]) : d.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
            },
            add: function(e, t) {
                return this.pushStack(S.uniqueSort(S.merge(this.get(), S(e, t))));
            },
            addBack: function(e) {
                return this.add(null == e ? this.prevObject : this.prevObject.filter(e));
            }
        }), S.each({
            parent: function(e) {
                var t = e.parentNode;
                return t && 11 !== t.nodeType ? t : null;
            },
            parents: function(e) {
                return k(e, "parentNode");
            },
            parentsUntil: function(e, t, r) {
                return k(e, "parentNode", r);
            },
            next: function(e) {
                return N(e, "nextSibling");
            },
            prev: function(e) {
                return N(e, "previousSibling");
            },
            nextAll: function(e) {
                return k(e, "nextSibling");
            },
            prevAll: function(e) {
                return k(e, "previousSibling");
            },
            nextUntil: function(e, t, r) {
                return k(e, "nextSibling", r);
            },
            prevUntil: function(e, t, r) {
                return k(e, "previousSibling", r);
            },
            siblings: function(e) {
                return C((e.parentNode || {}).firstChild, e);
            },
            children: function(e) {
                return C(e.firstChild);
            },
            contents: function(e) {
                return void 0 !== e.contentDocument ? e.contentDocument : (I(e, "template") && (e = e.content || e), 
                S.merge([], e.childNodes));
            }
        }, (function(e, t) {
            S.fn[e] = function(r, n) {
                var i = S.map(this, t, r);
                return "Until" !== e.slice(-5) && (n = r), n && "string" == typeof n && (i = S.filter(n, i)), 
                this.length > 1 && (q[e] || S.uniqueSort(i), P.test(e) && i.reverse()), this.pushStack(i);
            };
        }));
        var O = /[^\x20\t\r\n\f]+/g;
        function L(e) {
            return e;
        }
        function U(e) {
            throw e;
        }
        function z(e, t, r, n) {
            var i;
            try {
                e && y(i = e.promise) ? i.call(e).done(t).fail(r) : e && y(i = e.then) ? i.call(e, t, r) : t.apply(void 0, [ e ].slice(n));
            } catch (e) {
                r.apply(void 0, [ e ]);
            }
        }
        S.Callbacks = function(e) {
            e = "string" == typeof e ? function(e) {
                var t = {};
                return S.each(e.match(O) || [], (function(e, r) {
                    t[r] = !0;
                })), t;
            }(e) : S.extend({}, e);
            var t, r, n, i, o = [], a = [], s = -1, f = function() {
                for (i = i || e.once, n = t = !0; a.length; s = -1) for (r = a.shift(); ++s < o.length; ) !1 === o[s].apply(r[0], r[1]) && e.stopOnFalse && (s = o.length, 
                r = !1);
                e.memory || (r = !1), t = !1, i && (o = r ? [] : "");
            }, c = {
                add: function() {
                    return o && (r && !t && (s = o.length - 1, a.push(r)), function t(r) {
                        S.each(r, (function(r, n) {
                            y(n) ? e.unique && c.has(n) || o.push(n) : n && n.length && "string" !== x(n) && t(n);
                        }));
                    }(arguments), r && !t && f()), this;
                },
                remove: function() {
                    return S.each(arguments, (function(e, t) {
                        for (var r; (r = S.inArray(t, o, r)) > -1; ) o.splice(r, 1), r <= s && s--;
                    })), this;
                },
                has: function(e) {
                    return e ? S.inArray(e, o) > -1 : o.length > 0;
                },
                empty: function() {
                    return o && (o = []), this;
                },
                disable: function() {
                    return i = a = [], o = r = "", this;
                },
                disabled: function() {
                    return !o;
                },
                lock: function() {
                    return i = a = [], r || t || (o = r = ""), this;
                },
                locked: function() {
                    return !!i;
                },
                fireWith: function(e, r) {
                    return i || (r = [ e, (r = r || []).slice ? r.slice() : r ], a.push(r), t || f()), 
                    this;
                },
                fire: function() {
                    return c.fireWith(this, arguments), this;
                },
                fired: function() {
                    return !!n;
                }
            };
            return c;
        }, S.extend({
            Deferred: function(e) {
                var t = [ [ "notify", "progress", S.Callbacks("memory"), S.Callbacks("memory"), 2 ], [ "resolve", "done", S.Callbacks("once memory"), S.Callbacks("once memory"), 0, "resolved" ], [ "reject", "fail", S.Callbacks("once memory"), S.Callbacks("once memory"), 1, "rejected" ] ], n = "pending", i = {
                    state: function() {
                        return n;
                    },
                    always: function() {
                        return o.done(arguments).fail(arguments), this;
                    },
                    catch: function(e) {
                        return i.then(null, e);
                    },
                    pipe: function() {
                        var e = arguments;
                        return S.Deferred((function(r) {
                            S.each(t, (function(t, n) {
                                var i = y(e[n[4]]) && e[n[4]];
                                o[n[1]]((function() {
                                    var e = i && i.apply(this, arguments);
                                    e && y(e.promise) ? e.promise().progress(r.notify).done(r.resolve).fail(r.reject) : r[n[0] + "With"](this, i ? [ e ] : arguments);
                                }));
                            })), e = null;
                        })).promise();
                    },
                    then: function(e, n, i) {
                        var o = 0;
                        function a(e, t, n, i) {
                            return function() {
                                var s = this, f = arguments, c = function() {
                                    var r, c;
                                    if (!(e < o)) {
                                        if ((r = n.apply(s, f)) === t.promise()) throw new TypeError("Thenable self-resolution");
                                        c = r && ("object" == typeof r || "function" == typeof r) && r.then, y(c) ? i ? c.call(r, a(o, t, L, i), a(o, t, U, i)) : (o++, 
                                        c.call(r, a(o, t, L, i), a(o, t, U, i), a(o, t, L, t.notifyWith))) : (n !== L && (s = void 0, 
                                        f = [ r ]), (i || t.resolveWith)(s, f));
                                    }
                                }, u = i ? c : function() {
                                    try {
                                        c();
                                    } catch (r) {
                                        S.Deferred.exceptionHook && S.Deferred.exceptionHook(r, u.stackTrace), e + 1 >= o && (n !== U && (s = void 0, 
                                        f = [ r ]), t.rejectWith(s, f));
                                    }
                                };
                                e ? u() : (S.Deferred.getStackHook && (u.stackTrace = S.Deferred.getStackHook()), 
                                r.setTimeout(u));
                            };
                        }
                        return S.Deferred((function(r) {
                            t[0][3].add(a(0, r, y(i) ? i : L, r.notifyWith)), t[1][3].add(a(0, r, y(e) ? e : L)), 
                            t[2][3].add(a(0, r, y(n) ? n : U));
                        })).promise();
                    },
                    promise: function(e) {
                        return null != e ? S.extend(e, i) : i;
                    }
                }, o = {};
                return S.each(t, (function(e, r) {
                    var a = r[2], s = r[5];
                    i[r[1]] = a.add, s && a.add((function() {
                        n = s;
                    }), t[3 - e][2].disable, t[3 - e][3].disable, t[0][2].lock, t[0][3].lock), a.add(r[3].fire), 
                    o[r[0]] = function() {
                        return o[r[0] + "With"](this === o ? void 0 : this, arguments), this;
                    }, o[r[0] + "With"] = a.fireWith;
                })), i.promise(o), e && e.call(o, o), o;
            },
            when: function(e) {
                var t = arguments.length, r = t, n = Array(r), i = f.call(arguments), o = S.Deferred(), a = function(e) {
                    return function(r) {
                        n[e] = this, i[e] = arguments.length > 1 ? f.call(arguments) : r, --t || o.resolveWith(n, i);
                    };
                };
                if (t <= 1 && (z(e, o.done(a(r)).resolve, o.reject, !t), "pending" === o.state() || y(i[r] && i[r].then))) return o.then();
                for (;r--; ) z(i[r], a(r), o.reject);
                return o.promise();
            }
        });
        var H = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
        S.Deferred.exceptionHook = function(e, t) {
            r.console && r.console.warn && e && H.test(e.name) && r.console.warn("jQuery.Deferred exception: " + e.message, e.stack, t);
        }, S.readyException = function(e) {
            r.setTimeout((function() {
                throw e;
            }));
        };
        var F = S.Deferred();
        function W() {
            a.removeEventListener("DOMContentLoaded", W), r.removeEventListener("load", W), 
            S.ready();
        }
        S.fn.ready = function(e) {
            return F.then(e).catch((function(e) {
                S.readyException(e);
            })), this;
        }, S.extend({
            isReady: !1,
            readyWait: 1,
            ready: function(e) {
                (!0 === e ? --S.readyWait : S.isReady) || (S.isReady = !0, !0 !== e && --S.readyWait > 0 || F.resolveWith(a, [ S ]));
            }
        }), S.ready.then = F.then, "complete" === a.readyState || "loading" !== a.readyState && !a.documentElement.doScroll ? r.setTimeout(S.ready) : (a.addEventListener("DOMContentLoaded", W), 
        r.addEventListener("load", W));
        var K = function(e, t, r, n, i, o, a) {
            var s = 0, f = e.length, c = null == r;
            if ("object" === x(r)) for (s in i = !0, r) K(e, t, s, r[s], !0, o, a); else if (void 0 !== n && (i = !0, 
            y(n) || (a = !0), c && (a ? (t.call(e, n), t = null) : (c = t, t = function(e, t, r) {
                return c.call(S(e), r);
            })), t)) for (;s < f; s++) t(e[s], r, a ? n : n.call(e[s], s, t(e[s], r)));
            return i ? e : c ? t.call(e) : f ? t(e[0], r) : o;
        }, Y = /^-ms-/, V = /-([a-z])/g;
        function J(e, t) {
            return t.toUpperCase();
        }
        function G(e) {
            return e.replace(Y, "ms-").replace(V, J);
        }
        var X = function(e) {
            return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType;
        };
        function $() {
            this.expando = S.expando + $.uid++;
        }
        $.uid = 1, $.prototype = {
            cache: function(e) {
                var t = e[this.expando];
                return t || (t = {}, X(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
                    value: t,
                    configurable: !0
                }))), t;
            },
            set: function(e, t, r) {
                var n, i = this.cache(e);
                if ("string" == typeof t) i[G(t)] = r; else for (n in t) i[G(n)] = t[n];
                return i;
            },
            get: function(e, t) {
                return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][G(t)];
            },
            access: function(e, t, r) {
                return void 0 === t || t && "string" == typeof t && void 0 === r ? this.get(e, t) : (this.set(e, t, r), 
                void 0 !== r ? r : t);
            },
            remove: function(e, t) {
                var r, n = e[this.expando];
                if (void 0 !== n) {
                    if (void 0 !== t) {
                        r = (t = Array.isArray(t) ? t.map(G) : (t = G(t)) in n ? [ t ] : t.match(O) || []).length;
                        for (;r--; ) delete n[t[r]];
                    }
                    (void 0 === t || S.isEmptyObject(n)) && (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando]);
                }
            },
            hasData: function(e) {
                var t = e[this.expando];
                return void 0 !== t && !S.isEmptyObject(t);
            }
        };
        var Z = new $, Q = new $, ee = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, te = /[A-Z]/g;
        function re(e, t, r) {
            var n;
            if (void 0 === r && 1 === e.nodeType) if (n = "data-" + t.replace(te, "-$&").toLowerCase(), 
            "string" == typeof (r = e.getAttribute(n))) {
                try {
                    r = function(e) {
                        return "true" === e || "false" !== e && ("null" === e ? null : e === +e + "" ? +e : ee.test(e) ? JSON.parse(e) : e);
                    }(r);
                } catch (e) {}
                Q.set(e, t, r);
            } else r = void 0;
            return r;
        }
        S.extend({
            hasData: function(e) {
                return Q.hasData(e) || Z.hasData(e);
            },
            data: function(e, t, r) {
                return Q.access(e, t, r);
            },
            removeData: function(e, t) {
                Q.remove(e, t);
            },
            _data: function(e, t, r) {
                return Z.access(e, t, r);
            },
            _removeData: function(e, t) {
                Z.remove(e, t);
            }
        }), S.fn.extend({
            data: function(e, t) {
                var r, n, i, o = this[0], a = o && o.attributes;
                if (void 0 === e) {
                    if (this.length && (i = Q.get(o), 1 === o.nodeType && !Z.get(o, "hasDataAttrs"))) {
                        for (r = a.length; r--; ) a[r] && 0 === (n = a[r].name).indexOf("data-") && (n = G(n.slice(5)), 
                        re(o, n, i[n]));
                        Z.set(o, "hasDataAttrs", !0);
                    }
                    return i;
                }
                return "object" == typeof e ? this.each((function() {
                    Q.set(this, e);
                })) : K(this, (function(t) {
                    var r;
                    if (o && void 0 === t) return void 0 !== (r = Q.get(o, e)) || void 0 !== (r = re(o, e)) ? r : void 0;
                    this.each((function() {
                        Q.set(this, e, t);
                    }));
                }), null, t, arguments.length > 1, null, !0);
            },
            removeData: function(e) {
                return this.each((function() {
                    Q.remove(this, e);
                }));
            }
        }), S.extend({
            queue: function(e, t, r) {
                var n;
                if (e) return t = (t || "fx") + "queue", n = Z.get(e, t), r && (!n || Array.isArray(r) ? n = Z.access(e, t, S.makeArray(r)) : n.push(r)), 
                n || [];
            },
            dequeue: function(e, t) {
                t = t || "fx";
                var r = S.queue(e, t), n = r.length, i = r.shift(), o = S._queueHooks(e, t);
                "inprogress" === i && (i = r.shift(), n--), i && ("fx" === t && r.unshift("inprogress"), 
                delete o.stop, i.call(e, (function() {
                    S.dequeue(e, t);
                }), o)), !n && o && o.empty.fire();
            },
            _queueHooks: function(e, t) {
                var r = t + "queueHooks";
                return Z.get(e, r) || Z.access(e, r, {
                    empty: S.Callbacks("once memory").add((function() {
                        Z.remove(e, [ t + "queue", r ]);
                    }))
                });
            }
        }), S.fn.extend({
            queue: function(e, t) {
                var r = 2;
                return "string" != typeof e && (t = e, e = "fx", r--), arguments.length < r ? S.queue(this[0], e) : void 0 === t ? this : this.each((function() {
                    var r = S.queue(this, e, t);
                    S._queueHooks(this, e), "fx" === e && "inprogress" !== r[0] && S.dequeue(this, e);
                }));
            },
            dequeue: function(e) {
                return this.each((function() {
                    S.dequeue(this, e);
                }));
            },
            clearQueue: function(e) {
                return this.queue(e || "fx", []);
            },
            promise: function(e, t) {
                var r, n = 1, i = S.Deferred(), o = this, a = this.length, s = function() {
                    --n || i.resolveWith(o, [ o ]);
                };
                for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; a--; ) (r = Z.get(o[a], e + "queueHooks")) && r.empty && (n++, 
                r.empty.add(s));
                return s(), i.promise(t);
            }
        });
        var ne = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, ie = new RegExp("^(?:([+-])=|)(" + ne + ")([a-z%]*)$", "i"), oe = [ "Top", "Right", "Bottom", "Left" ], ae = a.documentElement, se = function(e) {
            return S.contains(e.ownerDocument, e);
        }, fe = {
            composed: !0
        };
        ae.getRootNode && (se = function(e) {
            return S.contains(e.ownerDocument, e) || e.getRootNode(fe) === e.ownerDocument;
        });
        var ce = function(e, t) {
            return "none" === (e = t || e).style.display || "" === e.style.display && se(e) && "none" === S.css(e, "display");
        }, ue = function(e, t, r, n) {
            var i, o, a = {};
            for (o in t) a[o] = e.style[o], e.style[o] = t[o];
            for (o in i = r.apply(e, n || []), t) e.style[o] = a[o];
            return i;
        };
        function de(e, t, r, n) {
            var i, o, a = 20, s = n ? function() {
                return n.cur();
            } : function() {
                return S.css(e, t, "");
            }, f = s(), c = r && r[3] || (S.cssNumber[t] ? "" : "px"), u = e.nodeType && (S.cssNumber[t] || "px" !== c && +f) && ie.exec(S.css(e, t));
            if (u && u[3] !== c) {
                for (f /= 2, c = c || u[3], u = +f || 1; a--; ) S.style(e, t, u + c), (1 - o) * (1 - (o = s() / f || .5)) <= 0 && (a = 0), 
                u /= o;
                u *= 2, S.style(e, t, u + c), r = r || [];
            }
            return r && (u = +u || +f || 0, i = r[1] ? u + (r[1] + 1) * r[2] : +r[2], n && (n.unit = c, 
            n.start = u, n.end = i)), i;
        }
        var he = {};
        function le(e) {
            var t, r = e.ownerDocument, n = e.nodeName, i = he[n];
            return i || (t = r.body.appendChild(r.createElement(n)), i = S.css(t, "display"), 
            t.parentNode.removeChild(t), "none" === i && (i = "block"), he[n] = i, i);
        }
        function pe(e, t) {
            for (var r, n, i = [], o = 0, a = e.length; o < a; o++) (n = e[o]).style && (r = n.style.display, 
            t ? ("none" === r && (i[o] = Z.get(n, "display") || null, i[o] || (n.style.display = "")), 
            "" === n.style.display && ce(n) && (i[o] = le(n))) : "none" !== r && (i[o] = "none", 
            Z.set(n, "display", r)));
            for (o = 0; o < a; o++) null != i[o] && (e[o].style.display = i[o]);
            return e;
        }
        S.fn.extend({
            show: function() {
                return pe(this, !0);
            },
            hide: function() {
                return pe(this);
            },
            toggle: function(e) {
                return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each((function() {
                    ce(this) ? S(this).show() : S(this).hide();
                }));
            }
        });
        var be = /^(?:checkbox|radio)$/i, me = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i, ge = /^$|^module$|\/(?:java|ecma)script/i, ye = {
            option: [ 1, "<select multiple='multiple'>", "</select>" ],
            thead: [ 1, "<table>", "</table>" ],
            col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
            tr: [ 2, "<table><tbody>", "</tbody></table>" ],
            td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
            _default: [ 0, "", "" ]
        };
        function ve(e, t) {
            var r;
            return r = void 0 !== e.getElementsByTagName ? e.getElementsByTagName(t || "*") : void 0 !== e.querySelectorAll ? e.querySelectorAll(t || "*") : [], 
            void 0 === t || t && I(e, t) ? S.merge([ e ], r) : r;
        }
        function we(e, t) {
            for (var r = 0, n = e.length; r < n; r++) Z.set(e[r], "globalEval", !t || Z.get(t[r], "globalEval"));
        }
        ye.optgroup = ye.option, ye.tbody = ye.tfoot = ye.colgroup = ye.caption = ye.thead, 
        ye.th = ye.td;
        var _e, xe, Se = /<|&#?\w+;/;
        function Ae(e, t, r, n, i) {
            for (var o, a, s, f, c, u, d = t.createDocumentFragment(), h = [], l = 0, p = e.length; l < p; l++) if ((o = e[l]) || 0 === o) if ("object" === x(o)) S.merge(h, o.nodeType ? [ o ] : o); else if (Se.test(o)) {
                for (a = a || d.appendChild(t.createElement("div")), s = (me.exec(o) || [ "", "" ])[1].toLowerCase(), 
                f = ye[s] || ye._default, a.innerHTML = f[1] + S.htmlPrefilter(o) + f[2], u = f[0]; u--; ) a = a.lastChild;
                S.merge(h, a.childNodes), (a = d.firstChild).textContent = "";
            } else h.push(t.createTextNode(o));
            for (d.textContent = "", l = 0; o = h[l++]; ) if (n && S.inArray(o, n) > -1) i && i.push(o); else if (c = se(o), 
            a = ve(d.appendChild(o), "script"), c && we(a), r) for (u = 0; o = a[u++]; ) ge.test(o.type || "") && r.push(o);
            return d;
        }
        _e = a.createDocumentFragment().appendChild(a.createElement("div")), (xe = a.createElement("input")).setAttribute("type", "radio"), 
        xe.setAttribute("checked", "checked"), xe.setAttribute("name", "t"), _e.appendChild(xe), 
        g.checkClone = _e.cloneNode(!0).cloneNode(!0).lastChild.checked, _e.innerHTML = "<textarea>x</textarea>", 
        g.noCloneChecked = !!_e.cloneNode(!0).lastChild.defaultValue;
        var Ee = /^key/, Me = /^(?:mouse|pointer|contextmenu|drag|drop)|click/, ke = /^([^.]*)(?:\.(.+)|)/;
        function Ce() {
            return !0;
        }
        function Te() {
            return !1;
        }
        function Ie(e, t) {
            return e === function() {
                try {
                    return a.activeElement;
                } catch (e) {}
            }() == ("focus" === t);
        }
        function Be(e, t, r, n, i, o) {
            var a, s;
            if ("object" == typeof t) {
                for (s in "string" != typeof r && (n = n || r, r = void 0), t) Be(e, s, r, n, t[s], o);
                return e;
            }
            if (null == n && null == i ? (i = r, n = r = void 0) : null == i && ("string" == typeof r ? (i = n, 
            n = void 0) : (i = n, n = r, r = void 0)), !1 === i) i = Te; else if (!i) return e;
            return 1 === o && (a = i, (i = function(e) {
                return S().off(e), a.apply(this, arguments);
            }).guid = a.guid || (a.guid = S.guid++)), e.each((function() {
                S.event.add(this, t, i, n, r);
            }));
        }
        function je(e, t, r) {
            r ? (Z.set(e, t, !1), S.event.add(e, t, {
                namespace: !1,
                handler: function(e) {
                    var n, i, o = Z.get(this, t);
                    if (1 & e.isTrigger && this[t]) {
                        if (o.length) (S.event.special[t] || {}).delegateType && e.stopPropagation(); else if (o = f.call(arguments), 
                        Z.set(this, t, o), n = r(this, t), this[t](), o !== (i = Z.get(this, t)) || n ? Z.set(this, t, !1) : i = {}, 
                        o !== i) return e.stopImmediatePropagation(), e.preventDefault(), i.value;
                    } else o.length && (Z.set(this, t, {
                        value: S.event.trigger(S.extend(o[0], S.Event.prototype), o.slice(1), this)
                    }), e.stopImmediatePropagation());
                }
            })) : void 0 === Z.get(e, t) && S.event.add(e, t, Ce);
        }
        S.event = {
            global: {},
            add: function(e, t, r, n, i) {
                var o, a, s, f, c, u, d, h, l, p, b, m = Z.get(e);
                if (m) for (r.handler && (r = (o = r).handler, i = o.selector), i && S.find.matchesSelector(ae, i), 
                r.guid || (r.guid = S.guid++), (f = m.events) || (f = m.events = {}), (a = m.handle) || (a = m.handle = function(t) {
                    return void 0 !== S && S.event.triggered !== t.type ? S.event.dispatch.apply(e, arguments) : void 0;
                }), c = (t = (t || "").match(O) || [ "" ]).length; c--; ) l = b = (s = ke.exec(t[c]) || [])[1], 
                p = (s[2] || "").split(".").sort(), l && (d = S.event.special[l] || {}, l = (i ? d.delegateType : d.bindType) || l, 
                d = S.event.special[l] || {}, u = S.extend({
                    type: l,
                    origType: b,
                    data: n,
                    handler: r,
                    guid: r.guid,
                    selector: i,
                    needsContext: i && S.expr.match.needsContext.test(i),
                    namespace: p.join(".")
                }, o), (h = f[l]) || ((h = f[l] = []).delegateCount = 0, d.setup && !1 !== d.setup.call(e, n, p, a) || e.addEventListener && e.addEventListener(l, a)), 
                d.add && (d.add.call(e, u), u.handler.guid || (u.handler.guid = r.guid)), i ? h.splice(h.delegateCount++, 0, u) : h.push(u), 
                S.event.global[l] = !0);
            },
            remove: function(e, t, r, n, i) {
                var o, a, s, f, c, u, d, h, l, p, b, m = Z.hasData(e) && Z.get(e);
                if (m && (f = m.events)) {
                    for (c = (t = (t || "").match(O) || [ "" ]).length; c--; ) if (l = b = (s = ke.exec(t[c]) || [])[1], 
                    p = (s[2] || "").split(".").sort(), l) {
                        for (d = S.event.special[l] || {}, h = f[l = (n ? d.delegateType : d.bindType) || l] || [], 
                        s = s[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"), a = o = h.length; o--; ) u = h[o], 
                        !i && b !== u.origType || r && r.guid !== u.guid || s && !s.test(u.namespace) || n && n !== u.selector && ("**" !== n || !u.selector) || (h.splice(o, 1), 
                        u.selector && h.delegateCount--, d.remove && d.remove.call(e, u));
                        a && !h.length && (d.teardown && !1 !== d.teardown.call(e, p, m.handle) || S.removeEvent(e, l, m.handle), 
                        delete f[l]);
                    } else for (l in f) S.event.remove(e, l + t[c], r, n, !0);
                    S.isEmptyObject(f) && Z.remove(e, "handle events");
                }
            },
            dispatch: function(e) {
                var t, r, n, i, o, a, s = S.event.fix(e), f = new Array(arguments.length), c = (Z.get(this, "events") || {})[s.type] || [], u = S.event.special[s.type] || {};
                for (f[0] = s, t = 1; t < arguments.length; t++) f[t] = arguments[t];
                if (s.delegateTarget = this, !u.preDispatch || !1 !== u.preDispatch.call(this, s)) {
                    for (a = S.event.handlers.call(this, s, c), t = 0; (i = a[t++]) && !s.isPropagationStopped(); ) for (s.currentTarget = i.elem, 
                    r = 0; (o = i.handlers[r++]) && !s.isImmediatePropagationStopped(); ) s.rnamespace && !1 !== o.namespace && !s.rnamespace.test(o.namespace) || (s.handleObj = o, 
                    s.data = o.data, void 0 !== (n = ((S.event.special[o.origType] || {}).handle || o.handler).apply(i.elem, f)) && !1 === (s.result = n) && (s.preventDefault(), 
                    s.stopPropagation()));
                    return u.postDispatch && u.postDispatch.call(this, s), s.result;
                }
            },
            handlers: function(e, t) {
                var r, n, i, o, a, s = [], f = t.delegateCount, c = e.target;
                if (f && c.nodeType && !("click" === e.type && e.button >= 1)) for (;c !== this; c = c.parentNode || this) if (1 === c.nodeType && ("click" !== e.type || !0 !== c.disabled)) {
                    for (o = [], a = {}, r = 0; r < f; r++) void 0 === a[i = (n = t[r]).selector + " "] && (a[i] = n.needsContext ? S(i, this).index(c) > -1 : S.find(i, this, null, [ c ]).length), 
                    a[i] && o.push(n);
                    o.length && s.push({
                        elem: c,
                        handlers: o
                    });
                }
                return c = this, f < t.length && s.push({
                    elem: c,
                    handlers: t.slice(f)
                }), s;
            },
            addProp: function(e, t) {
                Object.defineProperty(S.Event.prototype, e, {
                    enumerable: !0,
                    configurable: !0,
                    get: y(t) ? function() {
                        if (this.originalEvent) return t(this.originalEvent);
                    } : function() {
                        if (this.originalEvent) return this.originalEvent[e];
                    },
                    set: function(t) {
                        Object.defineProperty(this, e, {
                            enumerable: !0,
                            configurable: !0,
                            writable: !0,
                            value: t
                        });
                    }
                });
            },
            fix: function(e) {
                return e[S.expando] ? e : new S.Event(e);
            },
            special: {
                load: {
                    noBubble: !0
                },
                click: {
                    setup: function(e) {
                        var t = this || e;
                        return be.test(t.type) && t.click && I(t, "input") && je(t, "click", Ce), !1;
                    },
                    trigger: function(e) {
                        var t = this || e;
                        return be.test(t.type) && t.click && I(t, "input") && je(t, "click"), !0;
                    },
                    _default: function(e) {
                        var t = e.target;
                        return be.test(t.type) && t.click && I(t, "input") && Z.get(t, "click") || I(t, "a");
                    }
                },
                beforeunload: {
                    postDispatch: function(e) {
                        void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result);
                    }
                }
            }
        }, S.removeEvent = function(e, t, r) {
            e.removeEventListener && e.removeEventListener(t, r);
        }, S.Event = function(e, t) {
            if (!(this instanceof S.Event)) return new S.Event(e, t);
            e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? Ce : Te, 
            this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target, 
            this.currentTarget = e.currentTarget, this.relatedTarget = e.relatedTarget) : this.type = e, 
            t && S.extend(this, t), this.timeStamp = e && e.timeStamp || Date.now(), this[S.expando] = !0;
        }, S.Event.prototype = {
            constructor: S.Event,
            isDefaultPrevented: Te,
            isPropagationStopped: Te,
            isImmediatePropagationStopped: Te,
            isSimulated: !1,
            preventDefault: function() {
                var e = this.originalEvent;
                this.isDefaultPrevented = Ce, e && !this.isSimulated && e.preventDefault();
            },
            stopPropagation: function() {
                var e = this.originalEvent;
                this.isPropagationStopped = Ce, e && !this.isSimulated && e.stopPropagation();
            },
            stopImmediatePropagation: function() {
                var e = this.originalEvent;
                this.isImmediatePropagationStopped = Ce, e && !this.isSimulated && e.stopImmediatePropagation(), 
                this.stopPropagation();
            }
        }, S.each({
            altKey: !0,
            bubbles: !0,
            cancelable: !0,
            changedTouches: !0,
            ctrlKey: !0,
            detail: !0,
            eventPhase: !0,
            metaKey: !0,
            pageX: !0,
            pageY: !0,
            shiftKey: !0,
            view: !0,
            char: !0,
            code: !0,
            charCode: !0,
            key: !0,
            keyCode: !0,
            button: !0,
            buttons: !0,
            clientX: !0,
            clientY: !0,
            offsetX: !0,
            offsetY: !0,
            pointerId: !0,
            pointerType: !0,
            screenX: !0,
            screenY: !0,
            targetTouches: !0,
            toElement: !0,
            touches: !0,
            which: function(e) {
                var t = e.button;
                return null == e.which && Ee.test(e.type) ? null != e.charCode ? e.charCode : e.keyCode : !e.which && void 0 !== t && Me.test(e.type) ? 1 & t ? 1 : 2 & t ? 3 : 4 & t ? 2 : 0 : e.which;
            }
        }, S.event.addProp), S.each({
            focus: "focusin",
            blur: "focusout"
        }, (function(e, t) {
            S.event.special[e] = {
                setup: function() {
                    return je(this, e, Ie), !1;
                },
                trigger: function() {
                    return je(this, e), !0;
                },
                delegateType: t
            };
        })), S.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout",
            pointerenter: "pointerover",
            pointerleave: "pointerout"
        }, (function(e, t) {
            S.event.special[e] = {
                delegateType: t,
                bindType: t,
                handle: function(e) {
                    var r, n = this, i = e.relatedTarget, o = e.handleObj;
                    return i && (i === n || S.contains(n, i)) || (e.type = o.origType, r = o.handler.apply(this, arguments), 
                    e.type = t), r;
                }
            };
        })), S.fn.extend({
            on: function(e, t, r, n) {
                return Be(this, e, t, r, n);
            },
            one: function(e, t, r, n) {
                return Be(this, e, t, r, n, 1);
            },
            off: function(e, t, r) {
                var n, i;
                if (e && e.preventDefault && e.handleObj) return n = e.handleObj, S(e.delegateTarget).off(n.namespace ? n.origType + "." + n.namespace : n.origType, n.selector, n.handler), 
                this;
                if ("object" == typeof e) {
                    for (i in e) this.off(i, t, e[i]);
                    return this;
                }
                return !1 !== t && "function" != typeof t || (r = t, t = void 0), !1 === r && (r = Te), 
                this.each((function() {
                    S.event.remove(this, e, r, t);
                }));
            }
        });
        var Re = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi, De = /<script|<style|<link/i, Pe = /checked\s*(?:[^=]|=\s*.checked.)/i, qe = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
        function Ne(e, t) {
            return I(e, "table") && I(11 !== t.nodeType ? t : t.firstChild, "tr") && S(e).children("tbody")[0] || e;
        }
        function Oe(e) {
            return e.type = (null !== e.getAttribute("type")) + "/" + e.type, e;
        }
        function Le(e) {
            return "true/" === (e.type || "").slice(0, 5) ? e.type = e.type.slice(5) : e.removeAttribute("type"), 
            e;
        }
        function Ue(e, t) {
            var r, n, i, o, a, s, f, c;
            if (1 === t.nodeType) {
                if (Z.hasData(e) && (o = Z.access(e), a = Z.set(t, o), c = o.events)) for (i in delete a.handle, 
                a.events = {}, c) for (r = 0, n = c[i].length; r < n; r++) S.event.add(t, i, c[i][r]);
                Q.hasData(e) && (s = Q.access(e), f = S.extend({}, s), Q.set(t, f));
            }
        }
        function ze(e, t) {
            var r = t.nodeName.toLowerCase();
            "input" === r && be.test(e.type) ? t.checked = e.checked : "input" !== r && "textarea" !== r || (t.defaultValue = e.defaultValue);
        }
        function He(e, t, r, n) {
            t = c.apply([], t);
            var i, o, a, s, f, u, d = 0, h = e.length, l = h - 1, p = t[0], b = y(p);
            if (b || h > 1 && "string" == typeof p && !g.checkClone && Pe.test(p)) return e.each((function(i) {
                var o = e.eq(i);
                b && (t[0] = p.call(this, i, o.html())), He(o, t, r, n);
            }));
            if (h && (o = (i = Ae(t, e[0].ownerDocument, !1, e, n)).firstChild, 1 === i.childNodes.length && (i = o), 
            o || n)) {
                for (s = (a = S.map(ve(i, "script"), Oe)).length; d < h; d++) f = i, d !== l && (f = S.clone(f, !0, !0), 
                s && S.merge(a, ve(f, "script"))), r.call(e[d], f, d);
                if (s) for (u = a[a.length - 1].ownerDocument, S.map(a, Le), d = 0; d < s; d++) f = a[d], 
                ge.test(f.type || "") && !Z.access(f, "globalEval") && S.contains(u, f) && (f.src && "module" !== (f.type || "").toLowerCase() ? S._evalUrl && !f.noModule && S._evalUrl(f.src, {
                    nonce: f.nonce || f.getAttribute("nonce")
                }) : _(f.textContent.replace(qe, ""), f, u));
            }
            return e;
        }
        function Fe(e, t, r) {
            for (var n, i = t ? S.filter(t, e) : e, o = 0; null != (n = i[o]); o++) r || 1 !== n.nodeType || S.cleanData(ve(n)), 
            n.parentNode && (r && se(n) && we(ve(n, "script")), n.parentNode.removeChild(n));
            return e;
        }
        S.extend({
            htmlPrefilter: function(e) {
                return e.replace(Re, "<$1></$2>");
            },
            clone: function(e, t, r) {
                var n, i, o, a, s = e.cloneNode(!0), f = se(e);
                if (!(g.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || S.isXMLDoc(e))) for (a = ve(s), 
                n = 0, i = (o = ve(e)).length; n < i; n++) ze(o[n], a[n]);
                if (t) if (r) for (o = o || ve(e), a = a || ve(s), n = 0, i = o.length; n < i; n++) Ue(o[n], a[n]); else Ue(e, s);
                return (a = ve(s, "script")).length > 0 && we(a, !f && ve(e, "script")), s;
            },
            cleanData: function(e) {
                for (var t, r, n, i = S.event.special, o = 0; void 0 !== (r = e[o]); o++) if (X(r)) {
                    if (t = r[Z.expando]) {
                        if (t.events) for (n in t.events) i[n] ? S.event.remove(r, n) : S.removeEvent(r, n, t.handle);
                        r[Z.expando] = void 0;
                    }
                    r[Q.expando] && (r[Q.expando] = void 0);
                }
            }
        }), S.fn.extend({
            detach: function(e) {
                return Fe(this, e, !0);
            },
            remove: function(e) {
                return Fe(this, e);
            },
            text: function(e) {
                return K(this, (function(e) {
                    return void 0 === e ? S.text(this) : this.empty().each((function() {
                        1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e);
                    }));
                }), null, e, arguments.length);
            },
            append: function() {
                return He(this, arguments, (function(e) {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || Ne(this, e).appendChild(e);
                }));
            },
            prepend: function() {
                return He(this, arguments, (function(e) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var t = Ne(this, e);
                        t.insertBefore(e, t.firstChild);
                    }
                }));
            },
            before: function() {
                return He(this, arguments, (function(e) {
                    this.parentNode && this.parentNode.insertBefore(e, this);
                }));
            },
            after: function() {
                return He(this, arguments, (function(e) {
                    this.parentNode && this.parentNode.insertBefore(e, this.nextSibling);
                }));
            },
            empty: function() {
                for (var e, t = 0; null != (e = this[t]); t++) 1 === e.nodeType && (S.cleanData(ve(e, !1)), 
                e.textContent = "");
                return this;
            },
            clone: function(e, t) {
                return e = null != e && e, t = null == t ? e : t, this.map((function() {
                    return S.clone(this, e, t);
                }));
            },
            html: function(e) {
                return K(this, (function(e) {
                    var t = this[0] || {}, r = 0, n = this.length;
                    if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
                    if ("string" == typeof e && !De.test(e) && !ye[(me.exec(e) || [ "", "" ])[1].toLowerCase()]) {
                        e = S.htmlPrefilter(e);
                        try {
                            for (;r < n; r++) 1 === (t = this[r] || {}).nodeType && (S.cleanData(ve(t, !1)), 
                            t.innerHTML = e);
                            t = 0;
                        } catch (e) {}
                    }
                    t && this.empty().append(e);
                }), null, e, arguments.length);
            },
            replaceWith: function() {
                var e = [];
                return He(this, arguments, (function(t) {
                    var r = this.parentNode;
                    S.inArray(this, e) < 0 && (S.cleanData(ve(this)), r && r.replaceChild(t, this));
                }), e);
            }
        }), S.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, (function(e, t) {
            S.fn[e] = function(e) {
                for (var r, n = [], i = S(e), o = i.length - 1, a = 0; a <= o; a++) r = a === o ? this : this.clone(!0), 
                S(i[a])[t](r), u.apply(n, r.get());
                return this.pushStack(n);
            };
        }));
        var We = new RegExp("^(" + ne + ")(?!px)[a-z%]+$", "i"), Ke = function(e) {
            var t = e.ownerDocument.defaultView;
            return t && t.opener || (t = r), t.getComputedStyle(e);
        }, Ye = new RegExp(oe.join("|"), "i");
        function Ve(e, t, r) {
            var n, i, o, a, s = e.style;
            return (r = r || Ke(e)) && ("" !== (a = r.getPropertyValue(t) || r[t]) || se(e) || (a = S.style(e, t)), 
            !g.pixelBoxStyles() && We.test(a) && Ye.test(t) && (n = s.width, i = s.minWidth, 
            o = s.maxWidth, s.minWidth = s.maxWidth = s.width = a, a = r.width, s.width = n, 
            s.minWidth = i, s.maxWidth = o)), void 0 !== a ? a + "" : a;
        }
        function Je(e, t) {
            return {
                get: function() {
                    if (!e()) return (this.get = t).apply(this, arguments);
                    delete this.get;
                }
            };
        }
        !function() {
            function e() {
                if (u) {
                    c.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0", 
                    u.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%", 
                    ae.appendChild(c).appendChild(u);
                    var e = r.getComputedStyle(u);
                    n = "1%" !== e.top, f = 12 === t(e.marginLeft), u.style.right = "60%", s = 36 === t(e.right), 
                    i = 36 === t(e.width), u.style.position = "absolute", o = 12 === t(u.offsetWidth / 3), 
                    ae.removeChild(c), u = null;
                }
            }
            function t(e) {
                return Math.round(parseFloat(e));
            }
            var n, i, o, s, f, c = a.createElement("div"), u = a.createElement("div");
            u.style && (u.style.backgroundClip = "content-box", u.cloneNode(!0).style.backgroundClip = "", 
            g.clearCloneStyle = "content-box" === u.style.backgroundClip, S.extend(g, {
                boxSizingReliable: function() {
                    return e(), i;
                },
                pixelBoxStyles: function() {
                    return e(), s;
                },
                pixelPosition: function() {
                    return e(), n;
                },
                reliableMarginLeft: function() {
                    return e(), f;
                },
                scrollboxSize: function() {
                    return e(), o;
                }
            }));
        }();
        var Ge = [ "Webkit", "Moz", "ms" ], Xe = a.createElement("div").style, $e = {};
        function Ze(e) {
            var t = S.cssProps[e] || $e[e];
            return t || (e in Xe ? e : $e[e] = function(e) {
                for (var t = e[0].toUpperCase() + e.slice(1), r = Ge.length; r--; ) if ((e = Ge[r] + t) in Xe) return e;
            }(e) || e);
        }
        var Qe = /^(none|table(?!-c[ea]).+)/, et = /^--/, tt = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        }, rt = {
            letterSpacing: "0",
            fontWeight: "400"
        };
        function nt(e, t, r) {
            var n = ie.exec(t);
            return n ? Math.max(0, n[2] - (r || 0)) + (n[3] || "px") : t;
        }
        function it(e, t, r, n, i, o) {
            var a = "width" === t ? 1 : 0, s = 0, f = 0;
            if (r === (n ? "border" : "content")) return 0;
            for (;a < 4; a += 2) "margin" === r && (f += S.css(e, r + oe[a], !0, i)), n ? ("content" === r && (f -= S.css(e, "padding" + oe[a], !0, i)), 
            "margin" !== r && (f -= S.css(e, "border" + oe[a] + "Width", !0, i))) : (f += S.css(e, "padding" + oe[a], !0, i), 
            "padding" !== r ? f += S.css(e, "border" + oe[a] + "Width", !0, i) : s += S.css(e, "border" + oe[a] + "Width", !0, i));
            return !n && o >= 0 && (f += Math.max(0, Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - o - f - s - .5)) || 0), 
            f;
        }
        function ot(e, t, r) {
            var n = Ke(e), i = (!g.boxSizingReliable() || r) && "border-box" === S.css(e, "boxSizing", !1, n), o = i, a = Ve(e, t, n), s = "offset" + t[0].toUpperCase() + t.slice(1);
            if (We.test(a)) {
                if (!r) return a;
                a = "auto";
            }
            return (!g.boxSizingReliable() && i || "auto" === a || !parseFloat(a) && "inline" === S.css(e, "display", !1, n)) && e.getClientRects().length && (i = "border-box" === S.css(e, "boxSizing", !1, n), 
            (o = s in e) && (a = e[s])), (a = parseFloat(a) || 0) + it(e, t, r || (i ? "border" : "content"), o, n, a) + "px";
        }
        function at(e, t, r, n, i) {
            return new at.prototype.init(e, t, r, n, i);
        }
        S.extend({
            cssHooks: {
                opacity: {
                    get: function(e, t) {
                        if (t) {
                            var r = Ve(e, "opacity");
                            return "" === r ? "1" : r;
                        }
                    }
                }
            },
            cssNumber: {
                animationIterationCount: !0,
                columnCount: !0,
                fillOpacity: !0,
                flexGrow: !0,
                flexShrink: !0,
                fontWeight: !0,
                gridArea: !0,
                gridColumn: !0,
                gridColumnEnd: !0,
                gridColumnStart: !0,
                gridRow: !0,
                gridRowEnd: !0,
                gridRowStart: !0,
                lineHeight: !0,
                opacity: !0,
                order: !0,
                orphans: !0,
                widows: !0,
                zIndex: !0,
                zoom: !0
            },
            cssProps: {},
            style: function(e, t, r, n) {
                if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                    var i, o, a, s = G(t), f = et.test(t), c = e.style;
                    if (f || (t = Ze(s)), a = S.cssHooks[t] || S.cssHooks[s], void 0 === r) return a && "get" in a && void 0 !== (i = a.get(e, !1, n)) ? i : c[t];
                    "string" === (o = typeof r) && (i = ie.exec(r)) && i[1] && (r = de(e, t, i), o = "number"), 
                    null != r && r == r && ("number" !== o || f || (r += i && i[3] || (S.cssNumber[s] ? "" : "px")), 
                    g.clearCloneStyle || "" !== r || 0 !== t.indexOf("background") || (c[t] = "inherit"), 
                    a && "set" in a && void 0 === (r = a.set(e, r, n)) || (f ? c.setProperty(t, r) : c[t] = r));
                }
            },
            css: function(e, t, r, n) {
                var i, o, a, s = G(t);
                return et.test(t) || (t = Ze(s)), (a = S.cssHooks[t] || S.cssHooks[s]) && "get" in a && (i = a.get(e, !0, r)), 
                void 0 === i && (i = Ve(e, t, n)), "normal" === i && t in rt && (i = rt[t]), "" === r || r ? (o = parseFloat(i), 
                !0 === r || isFinite(o) ? o || 0 : i) : i;
            }
        }), S.each([ "height", "width" ], (function(e, t) {
            S.cssHooks[t] = {
                get: function(e, r, n) {
                    if (r) return !Qe.test(S.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? ot(e, t, n) : ue(e, tt, (function() {
                        return ot(e, t, n);
                    }));
                },
                set: function(e, r, n) {
                    var i, o = Ke(e), a = !g.scrollboxSize() && "absolute" === o.position, s = (a || n) && "border-box" === S.css(e, "boxSizing", !1, o), f = n ? it(e, t, n, s, o) : 0;
                    return s && a && (f -= Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - parseFloat(o[t]) - it(e, t, "border", !1, o) - .5)), 
                    f && (i = ie.exec(r)) && "px" !== (i[3] || "px") && (e.style[t] = r, r = S.css(e, t)), 
                    nt(0, r, f);
                }
            };
        })), S.cssHooks.marginLeft = Je(g.reliableMarginLeft, (function(e, t) {
            if (t) return (parseFloat(Ve(e, "marginLeft")) || e.getBoundingClientRect().left - ue(e, {
                marginLeft: 0
            }, (function() {
                return e.getBoundingClientRect().left;
            }))) + "px";
        })), S.each({
            margin: "",
            padding: "",
            border: "Width"
        }, (function(e, t) {
            S.cssHooks[e + t] = {
                expand: function(r) {
                    for (var n = 0, i = {}, o = "string" == typeof r ? r.split(" ") : [ r ]; n < 4; n++) i[e + oe[n] + t] = o[n] || o[n - 2] || o[0];
                    return i;
                }
            }, "margin" !== e && (S.cssHooks[e + t].set = nt);
        })), S.fn.extend({
            css: function(e, t) {
                return K(this, (function(e, t, r) {
                    var n, i, o = {}, a = 0;
                    if (Array.isArray(t)) {
                        for (n = Ke(e), i = t.length; a < i; a++) o[t[a]] = S.css(e, t[a], !1, n);
                        return o;
                    }
                    return void 0 !== r ? S.style(e, t, r) : S.css(e, t);
                }), e, t, arguments.length > 1);
            }
        }), S.Tween = at, at.prototype = {
            constructor: at,
            init: function(e, t, r, n, i, o) {
                this.elem = e, this.prop = r, this.easing = i || S.easing._default, this.options = t, 
                this.start = this.now = this.cur(), this.end = n, this.unit = o || (S.cssNumber[r] ? "" : "px");
            },
            cur: function() {
                var e = at.propHooks[this.prop];
                return e && e.get ? e.get(this) : at.propHooks._default.get(this);
            },
            run: function(e) {
                var t, r = at.propHooks[this.prop];
                return this.options.duration ? this.pos = t = S.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, 
                this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), 
                r && r.set ? r.set(this) : at.propHooks._default.set(this), this;
            }
        }, at.prototype.init.prototype = at.prototype, at.propHooks = {
            _default: {
                get: function(e) {
                    var t;
                    return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = S.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0;
                },
                set: function(e) {
                    S.fx.step[e.prop] ? S.fx.step[e.prop](e) : 1 !== e.elem.nodeType || !S.cssHooks[e.prop] && null == e.elem.style[Ze(e.prop)] ? e.elem[e.prop] = e.now : S.style(e.elem, e.prop, e.now + e.unit);
                }
            }
        }, at.propHooks.scrollTop = at.propHooks.scrollLeft = {
            set: function(e) {
                e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now);
            }
        }, S.easing = {
            linear: function(e) {
                return e;
            },
            swing: function(e) {
                return .5 - Math.cos(e * Math.PI) / 2;
            },
            _default: "swing"
        }, S.fx = at.prototype.init, S.fx.step = {};
        var st, ft, ct = /^(?:toggle|show|hide)$/, ut = /queueHooks$/;
        function dt() {
            ft && (!1 === a.hidden && r.requestAnimationFrame ? r.requestAnimationFrame(dt) : r.setTimeout(dt, S.fx.interval), 
            S.fx.tick());
        }
        function ht() {
            return r.setTimeout((function() {
                st = void 0;
            })), st = Date.now();
        }
        function lt(e, t) {
            var r, n = 0, i = {
                height: e
            };
            for (t = t ? 1 : 0; n < 4; n += 2 - t) i["margin" + (r = oe[n])] = i["padding" + r] = e;
            return t && (i.opacity = i.width = e), i;
        }
        function pt(e, t, r) {
            for (var n, i = (bt.tweeners[t] || []).concat(bt.tweeners["*"]), o = 0, a = i.length; o < a; o++) if (n = i[o].call(r, t, e)) return n;
        }
        function bt(e, t, r) {
            var n, i, o = 0, a = bt.prefilters.length, s = S.Deferred().always((function() {
                delete f.elem;
            })), f = function() {
                if (i) return !1;
                for (var t = st || ht(), r = Math.max(0, c.startTime + c.duration - t), n = 1 - (r / c.duration || 0), o = 0, a = c.tweens.length; o < a; o++) c.tweens[o].run(n);
                return s.notifyWith(e, [ c, n, r ]), n < 1 && a ? r : (a || s.notifyWith(e, [ c, 1, 0 ]), 
                s.resolveWith(e, [ c ]), !1);
            }, c = s.promise({
                elem: e,
                props: S.extend({}, t),
                opts: S.extend(!0, {
                    specialEasing: {},
                    easing: S.easing._default
                }, r),
                originalProperties: t,
                originalOptions: r,
                startTime: st || ht(),
                duration: r.duration,
                tweens: [],
                createTween: function(t, r) {
                    var n = S.Tween(e, c.opts, t, r, c.opts.specialEasing[t] || c.opts.easing);
                    return c.tweens.push(n), n;
                },
                stop: function(t) {
                    var r = 0, n = t ? c.tweens.length : 0;
                    if (i) return this;
                    for (i = !0; r < n; r++) c.tweens[r].run(1);
                    return t ? (s.notifyWith(e, [ c, 1, 0 ]), s.resolveWith(e, [ c, t ])) : s.rejectWith(e, [ c, t ]), 
                    this;
                }
            }), u = c.props;
            for (!function(e, t) {
                var r, n, i, o, a;
                for (r in e) if (i = t[n = G(r)], o = e[r], Array.isArray(o) && (i = o[1], o = e[r] = o[0]), 
                r !== n && (e[n] = o, delete e[r]), (a = S.cssHooks[n]) && "expand" in a) for (r in o = a.expand(o), 
                delete e[n], o) r in e || (e[r] = o[r], t[r] = i); else t[n] = i;
            }(u, c.opts.specialEasing); o < a; o++) if (n = bt.prefilters[o].call(c, e, u, c.opts)) return y(n.stop) && (S._queueHooks(c.elem, c.opts.queue).stop = n.stop.bind(n)), 
            n;
            return S.map(u, pt, c), y(c.opts.start) && c.opts.start.call(e, c), c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always), 
            S.fx.timer(S.extend(f, {
                elem: e,
                anim: c,
                queue: c.opts.queue
            })), c;
        }
        S.Animation = S.extend(bt, {
            tweeners: {
                "*": [ function(e, t) {
                    var r = this.createTween(e, t);
                    return de(r.elem, e, ie.exec(t), r), r;
                } ]
            },
            tweener: function(e, t) {
                y(e) ? (t = e, e = [ "*" ]) : e = e.match(O);
                for (var r, n = 0, i = e.length; n < i; n++) r = e[n], bt.tweeners[r] = bt.tweeners[r] || [], 
                bt.tweeners[r].unshift(t);
            },
            prefilters: [ function(e, t, r) {
                var n, i, o, a, s, f, c, u, d = "width" in t || "height" in t, h = this, l = {}, p = e.style, b = e.nodeType && ce(e), m = Z.get(e, "fxshow");
                for (n in r.queue || (null == (a = S._queueHooks(e, "fx")).unqueued && (a.unqueued = 0, 
                s = a.empty.fire, a.empty.fire = function() {
                    a.unqueued || s();
                }), a.unqueued++, h.always((function() {
                    h.always((function() {
                        a.unqueued--, S.queue(e, "fx").length || a.empty.fire();
                    }));
                }))), t) if (i = t[n], ct.test(i)) {
                    if (delete t[n], o = o || "toggle" === i, i === (b ? "hide" : "show")) {
                        if ("show" !== i || !m || void 0 === m[n]) continue;
                        b = !0;
                    }
                    l[n] = m && m[n] || S.style(e, n);
                }
                if ((f = !S.isEmptyObject(t)) || !S.isEmptyObject(l)) for (n in d && 1 === e.nodeType && (r.overflow = [ p.overflow, p.overflowX, p.overflowY ], 
                null == (c = m && m.display) && (c = Z.get(e, "display")), "none" === (u = S.css(e, "display")) && (c ? u = c : (pe([ e ], !0), 
                c = e.style.display || c, u = S.css(e, "display"), pe([ e ]))), ("inline" === u || "inline-block" === u && null != c) && "none" === S.css(e, "float") && (f || (h.done((function() {
                    p.display = c;
                })), null == c && (u = p.display, c = "none" === u ? "" : u)), p.display = "inline-block")), 
                r.overflow && (p.overflow = "hidden", h.always((function() {
                    p.overflow = r.overflow[0], p.overflowX = r.overflow[1], p.overflowY = r.overflow[2];
                }))), f = !1, l) f || (m ? "hidden" in m && (b = m.hidden) : m = Z.access(e, "fxshow", {
                    display: c
                }), o && (m.hidden = !b), b && pe([ e ], !0), h.done((function() {
                    for (n in b || pe([ e ]), Z.remove(e, "fxshow"), l) S.style(e, n, l[n]);
                }))), f = pt(b ? m[n] : 0, n, h), n in m || (m[n] = f.start, b && (f.end = f.start, 
                f.start = 0));
            } ],
            prefilter: function(e, t) {
                t ? bt.prefilters.unshift(e) : bt.prefilters.push(e);
            }
        }), S.speed = function(e, t, r) {
            var n = e && "object" == typeof e ? S.extend({}, e) : {
                complete: r || !r && t || y(e) && e,
                duration: e,
                easing: r && t || t && !y(t) && t
            };
            return S.fx.off ? n.duration = 0 : "number" != typeof n.duration && (n.duration in S.fx.speeds ? n.duration = S.fx.speeds[n.duration] : n.duration = S.fx.speeds._default), 
            null != n.queue && !0 !== n.queue || (n.queue = "fx"), n.old = n.complete, n.complete = function() {
                y(n.old) && n.old.call(this), n.queue && S.dequeue(this, n.queue);
            }, n;
        }, S.fn.extend({
            fadeTo: function(e, t, r, n) {
                return this.filter(ce).css("opacity", 0).show().end().animate({
                    opacity: t
                }, e, r, n);
            },
            animate: function(e, t, r, n) {
                var i = S.isEmptyObject(e), o = S.speed(t, r, n), a = function() {
                    var t = bt(this, S.extend({}, e), o);
                    (i || Z.get(this, "finish")) && t.stop(!0);
                };
                return a.finish = a, i || !1 === o.queue ? this.each(a) : this.queue(o.queue, a);
            },
            stop: function(e, t, r) {
                var n = function(e) {
                    var t = e.stop;
                    delete e.stop, t(r);
                };
                return "string" != typeof e && (r = t, t = e, e = void 0), t && !1 !== e && this.queue(e || "fx", []), 
                this.each((function() {
                    var t = !0, i = null != e && e + "queueHooks", o = S.timers, a = Z.get(this);
                    if (i) a[i] && a[i].stop && n(a[i]); else for (i in a) a[i] && a[i].stop && ut.test(i) && n(a[i]);
                    for (i = o.length; i--; ) o[i].elem !== this || null != e && o[i].queue !== e || (o[i].anim.stop(r), 
                    t = !1, o.splice(i, 1));
                    !t && r || S.dequeue(this, e);
                }));
            },
            finish: function(e) {
                return !1 !== e && (e = e || "fx"), this.each((function() {
                    var t, r = Z.get(this), n = r[e + "queue"], i = r[e + "queueHooks"], o = S.timers, a = n ? n.length : 0;
                    for (r.finish = !0, S.queue(this, e, []), i && i.stop && i.stop.call(this, !0), 
                    t = o.length; t--; ) o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), 
                    o.splice(t, 1));
                    for (t = 0; t < a; t++) n[t] && n[t].finish && n[t].finish.call(this);
                    delete r.finish;
                }));
            }
        }), S.each([ "toggle", "show", "hide" ], (function(e, t) {
            var r = S.fn[t];
            S.fn[t] = function(e, n, i) {
                return null == e || "boolean" == typeof e ? r.apply(this, arguments) : this.animate(lt(t, !0), e, n, i);
            };
        })), S.each({
            slideDown: lt("show"),
            slideUp: lt("hide"),
            slideToggle: lt("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, (function(e, t) {
            S.fn[e] = function(e, r, n) {
                return this.animate(t, e, r, n);
            };
        })), S.timers = [], S.fx.tick = function() {
            var e, t = 0, r = S.timers;
            for (st = Date.now(); t < r.length; t++) (e = r[t])() || r[t] !== e || r.splice(t--, 1);
            r.length || S.fx.stop(), st = void 0;
        }, S.fx.timer = function(e) {
            S.timers.push(e), S.fx.start();
        }, S.fx.interval = 13, S.fx.start = function() {
            ft || (ft = !0, dt());
        }, S.fx.stop = function() {
            ft = null;
        }, S.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        }, S.fn.delay = function(e, t) {
            return e = S.fx && S.fx.speeds[e] || e, t = t || "fx", this.queue(t, (function(t, n) {
                var i = r.setTimeout(t, e);
                n.stop = function() {
                    r.clearTimeout(i);
                };
            }));
        }, function() {
            var e = a.createElement("input"), t = a.createElement("select").appendChild(a.createElement("option"));
            e.type = "checkbox", g.checkOn = "" !== e.value, g.optSelected = t.selected, (e = a.createElement("input")).value = "t", 
            e.type = "radio", g.radioValue = "t" === e.value;
        }();
        var mt, gt = S.expr.attrHandle;
        S.fn.extend({
            attr: function(e, t) {
                return K(this, S.attr, e, t, arguments.length > 1);
            },
            removeAttr: function(e) {
                return this.each((function() {
                    S.removeAttr(this, e);
                }));
            }
        }), S.extend({
            attr: function(e, t, r) {
                var n, i, o = e.nodeType;
                if (3 !== o && 8 !== o && 2 !== o) return void 0 === e.getAttribute ? S.prop(e, t, r) : (1 === o && S.isXMLDoc(e) || (i = S.attrHooks[t.toLowerCase()] || (S.expr.match.bool.test(t) ? mt : void 0)), 
                void 0 !== r ? null === r ? void S.removeAttr(e, t) : i && "set" in i && void 0 !== (n = i.set(e, r, t)) ? n : (e.setAttribute(t, r + ""), 
                r) : i && "get" in i && null !== (n = i.get(e, t)) ? n : null == (n = S.find.attr(e, t)) ? void 0 : n);
            },
            attrHooks: {
                type: {
                    set: function(e, t) {
                        if (!g.radioValue && "radio" === t && I(e, "input")) {
                            var r = e.value;
                            return e.setAttribute("type", t), r && (e.value = r), t;
                        }
                    }
                }
            },
            removeAttr: function(e, t) {
                var r, n = 0, i = t && t.match(O);
                if (i && 1 === e.nodeType) for (;r = i[n++]; ) e.removeAttribute(r);
            }
        }), mt = {
            set: function(e, t, r) {
                return !1 === t ? S.removeAttr(e, r) : e.setAttribute(r, r), r;
            }
        }, S.each(S.expr.match.bool.source.match(/\w+/g), (function(e, t) {
            var r = gt[t] || S.find.attr;
            gt[t] = function(e, t, n) {
                var i, o, a = t.toLowerCase();
                return n || (o = gt[a], gt[a] = i, i = null != r(e, t, n) ? a : null, gt[a] = o), 
                i;
            };
        }));
        var yt = /^(?:input|select|textarea|button)$/i, vt = /^(?:a|area)$/i;
        function wt(e) {
            return (e.match(O) || []).join(" ");
        }
        function _t(e) {
            return e.getAttribute && e.getAttribute("class") || "";
        }
        function xt(e) {
            return Array.isArray(e) ? e : "string" == typeof e && e.match(O) || [];
        }
        S.fn.extend({
            prop: function(e, t) {
                return K(this, S.prop, e, t, arguments.length > 1);
            },
            removeProp: function(e) {
                return this.each((function() {
                    delete this[S.propFix[e] || e];
                }));
            }
        }), S.extend({
            prop: function(e, t, r) {
                var n, i, o = e.nodeType;
                if (3 !== o && 8 !== o && 2 !== o) return 1 === o && S.isXMLDoc(e) || (t = S.propFix[t] || t, 
                i = S.propHooks[t]), void 0 !== r ? i && "set" in i && void 0 !== (n = i.set(e, r, t)) ? n : e[t] = r : i && "get" in i && null !== (n = i.get(e, t)) ? n : e[t];
            },
            propHooks: {
                tabIndex: {
                    get: function(e) {
                        var t = S.find.attr(e, "tabindex");
                        return t ? parseInt(t, 10) : yt.test(e.nodeName) || vt.test(e.nodeName) && e.href ? 0 : -1;
                    }
                }
            },
            propFix: {
                for: "htmlFor",
                class: "className"
            }
        }), g.optSelected || (S.propHooks.selected = {
            get: function(e) {
                var t = e.parentNode;
                return t && t.parentNode && t.parentNode.selectedIndex, null;
            },
            set: function(e) {
                var t = e.parentNode;
                t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex);
            }
        }), S.each([ "tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable" ], (function() {
            S.propFix[this.toLowerCase()] = this;
        })), S.fn.extend({
            addClass: function(e) {
                var t, r, n, i, o, a, s, f = 0;
                if (y(e)) return this.each((function(t) {
                    S(this).addClass(e.call(this, t, _t(this)));
                }));
                if ((t = xt(e)).length) for (;r = this[f++]; ) if (i = _t(r), n = 1 === r.nodeType && " " + wt(i) + " ") {
                    for (a = 0; o = t[a++]; ) n.indexOf(" " + o + " ") < 0 && (n += o + " ");
                    i !== (s = wt(n)) && r.setAttribute("class", s);
                }
                return this;
            },
            removeClass: function(e) {
                var t, r, n, i, o, a, s, f = 0;
                if (y(e)) return this.each((function(t) {
                    S(this).removeClass(e.call(this, t, _t(this)));
                }));
                if (!arguments.length) return this.attr("class", "");
                if ((t = xt(e)).length) for (;r = this[f++]; ) if (i = _t(r), n = 1 === r.nodeType && " " + wt(i) + " ") {
                    for (a = 0; o = t[a++]; ) for (;n.indexOf(" " + o + " ") > -1; ) n = n.replace(" " + o + " ", " ");
                    i !== (s = wt(n)) && r.setAttribute("class", s);
                }
                return this;
            },
            toggleClass: function(e, t) {
                var r = typeof e, n = "string" === r || Array.isArray(e);
                return "boolean" == typeof t && n ? t ? this.addClass(e) : this.removeClass(e) : y(e) ? this.each((function(r) {
                    S(this).toggleClass(e.call(this, r, _t(this), t), t);
                })) : this.each((function() {
                    var t, i, o, a;
                    if (n) for (i = 0, o = S(this), a = xt(e); t = a[i++]; ) o.hasClass(t) ? o.removeClass(t) : o.addClass(t); else void 0 !== e && "boolean" !== r || ((t = _t(this)) && Z.set(this, "__className__", t), 
                    this.setAttribute && this.setAttribute("class", t || !1 === e ? "" : Z.get(this, "__className__") || ""));
                }));
            },
            hasClass: function(e) {
                var t, r, n = 0;
                for (t = " " + e + " "; r = this[n++]; ) if (1 === r.nodeType && (" " + wt(_t(r)) + " ").indexOf(t) > -1) return !0;
                return !1;
            }
        });
        var St = /\r/g;
        S.fn.extend({
            val: function(e) {
                var t, r, n, i = this[0];
                return arguments.length ? (n = y(e), this.each((function(r) {
                    var i;
                    1 === this.nodeType && (null == (i = n ? e.call(this, r, S(this).val()) : e) ? i = "" : "number" == typeof i ? i += "" : Array.isArray(i) && (i = S.map(i, (function(e) {
                        return null == e ? "" : e + "";
                    }))), (t = S.valHooks[this.type] || S.valHooks[this.nodeName.toLowerCase()]) && "set" in t && void 0 !== t.set(this, i, "value") || (this.value = i));
                }))) : i ? (t = S.valHooks[i.type] || S.valHooks[i.nodeName.toLowerCase()]) && "get" in t && void 0 !== (r = t.get(i, "value")) ? r : "string" == typeof (r = i.value) ? r.replace(St, "") : null == r ? "" : r : void 0;
            }
        }), S.extend({
            valHooks: {
                option: {
                    get: function(e) {
                        var t = S.find.attr(e, "value");
                        return null != t ? t : wt(S.text(e));
                    }
                },
                select: {
                    get: function(e) {
                        var t, r, n, i = e.options, o = e.selectedIndex, a = "select-one" === e.type, s = a ? null : [], f = a ? o + 1 : i.length;
                        for (n = o < 0 ? f : a ? o : 0; n < f; n++) if (((r = i[n]).selected || n === o) && !r.disabled && (!r.parentNode.disabled || !I(r.parentNode, "optgroup"))) {
                            if (t = S(r).val(), a) return t;
                            s.push(t);
                        }
                        return s;
                    },
                    set: function(e, t) {
                        for (var r, n, i = e.options, o = S.makeArray(t), a = i.length; a--; ) ((n = i[a]).selected = S.inArray(S.valHooks.option.get(n), o) > -1) && (r = !0);
                        return r || (e.selectedIndex = -1), o;
                    }
                }
            }
        }), S.each([ "radio", "checkbox" ], (function() {
            S.valHooks[this] = {
                set: function(e, t) {
                    if (Array.isArray(t)) return e.checked = S.inArray(S(e).val(), t) > -1;
                }
            }, g.checkOn || (S.valHooks[this].get = function(e) {
                return null === e.getAttribute("value") ? "on" : e.value;
            });
        })), g.focusin = "onfocusin" in r;
        var At = /^(?:focusinfocus|focusoutblur)$/, Et = function(e) {
            e.stopPropagation();
        };
        S.extend(S.event, {
            trigger: function(e, t, n, i) {
                var o, s, f, c, u, d, h, l, b = [ n || a ], m = p.call(e, "type") ? e.type : e, g = p.call(e, "namespace") ? e.namespace.split(".") : [];
                if (s = l = f = n = n || a, 3 !== n.nodeType && 8 !== n.nodeType && !At.test(m + S.event.triggered) && (m.indexOf(".") > -1 && (g = m.split("."), 
                m = g.shift(), g.sort()), u = m.indexOf(":") < 0 && "on" + m, (e = e[S.expando] ? e : new S.Event(m, "object" == typeof e && e)).isTrigger = i ? 2 : 3, 
                e.namespace = g.join("."), e.rnamespace = e.namespace ? new RegExp("(^|\\.)" + g.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, 
                e.result = void 0, e.target || (e.target = n), t = null == t ? [ e ] : S.makeArray(t, [ e ]), 
                h = S.event.special[m] || {}, i || !h.trigger || !1 !== h.trigger.apply(n, t))) {
                    if (!i && !h.noBubble && !v(n)) {
                        for (c = h.delegateType || m, At.test(c + m) || (s = s.parentNode); s; s = s.parentNode) b.push(s), 
                        f = s;
                        f === (n.ownerDocument || a) && b.push(f.defaultView || f.parentWindow || r);
                    }
                    for (o = 0; (s = b[o++]) && !e.isPropagationStopped(); ) l = s, e.type = o > 1 ? c : h.bindType || m, 
                    (d = (Z.get(s, "events") || {})[e.type] && Z.get(s, "handle")) && d.apply(s, t), 
                    (d = u && s[u]) && d.apply && X(s) && (e.result = d.apply(s, t), !1 === e.result && e.preventDefault());
                    return e.type = m, i || e.isDefaultPrevented() || h._default && !1 !== h._default.apply(b.pop(), t) || !X(n) || u && y(n[m]) && !v(n) && ((f = n[u]) && (n[u] = null), 
                    S.event.triggered = m, e.isPropagationStopped() && l.addEventListener(m, Et), n[m](), 
                    e.isPropagationStopped() && l.removeEventListener(m, Et), S.event.triggered = void 0, 
                    f && (n[u] = f)), e.result;
                }
            },
            simulate: function(e, t, r) {
                var n = S.extend(new S.Event, r, {
                    type: e,
                    isSimulated: !0
                });
                S.event.trigger(n, null, t);
            }
        }), S.fn.extend({
            trigger: function(e, t) {
                return this.each((function() {
                    S.event.trigger(e, t, this);
                }));
            },
            triggerHandler: function(e, t) {
                var r = this[0];
                if (r) return S.event.trigger(e, t, r, !0);
            }
        }), g.focusin || S.each({
            focus: "focusin",
            blur: "focusout"
        }, (function(e, t) {
            var r = function(e) {
                S.event.simulate(t, e.target, S.event.fix(e));
            };
            S.event.special[t] = {
                setup: function() {
                    var n = this.ownerDocument || this, i = Z.access(n, t);
                    i || n.addEventListener(e, r, !0), Z.access(n, t, (i || 0) + 1);
                },
                teardown: function() {
                    var n = this.ownerDocument || this, i = Z.access(n, t) - 1;
                    i ? Z.access(n, t, i) : (n.removeEventListener(e, r, !0), Z.remove(n, t));
                }
            };
        }));
        var Mt = r.location, kt = Date.now(), Ct = /\?/;
        S.parseXML = function(e) {
            var t;
            if (!e || "string" != typeof e) return null;
            try {
                t = (new r.DOMParser).parseFromString(e, "text/xml");
            } catch (e) {
                t = void 0;
            }
            return t && !t.getElementsByTagName("parsererror").length || S.error("Invalid XML: " + e), 
            t;
        };
        var Tt = /\[\]$/, It = /\r?\n/g, Bt = /^(?:submit|button|image|reset|file)$/i, jt = /^(?:input|select|textarea|keygen)/i;
        function Rt(e, t, r, n) {
            var i;
            if (Array.isArray(t)) S.each(t, (function(t, i) {
                r || Tt.test(e) ? n(e, i) : Rt(e + "[" + ("object" == typeof i && null != i ? t : "") + "]", i, r, n);
            })); else if (r || "object" !== x(t)) n(e, t); else for (i in t) Rt(e + "[" + i + "]", t[i], r, n);
        }
        S.param = function(e, t) {
            var r, n = [], i = function(e, t) {
                var r = y(t) ? t() : t;
                n[n.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == r ? "" : r);
            };
            if (null == e) return "";
            if (Array.isArray(e) || e.jquery && !S.isPlainObject(e)) S.each(e, (function() {
                i(this.name, this.value);
            })); else for (r in e) Rt(r, e[r], t, i);
            return n.join("&");
        }, S.fn.extend({
            serialize: function() {
                return S.param(this.serializeArray());
            },
            serializeArray: function() {
                return this.map((function() {
                    var e = S.prop(this, "elements");
                    return e ? S.makeArray(e) : this;
                })).filter((function() {
                    var e = this.type;
                    return this.name && !S(this).is(":disabled") && jt.test(this.nodeName) && !Bt.test(e) && (this.checked || !be.test(e));
                })).map((function(e, t) {
                    var r = S(this).val();
                    return null == r ? null : Array.isArray(r) ? S.map(r, (function(e) {
                        return {
                            name: t.name,
                            value: e.replace(It, "\r\n")
                        };
                    })) : {
                        name: t.name,
                        value: r.replace(It, "\r\n")
                    };
                })).get();
            }
        });
        var Dt = /%20/g, Pt = /#.*$/, qt = /([?&])_=[^&]*/, Nt = /^(.*?):[ \t]*([^\r\n]*)$/gm, Ot = /^(?:GET|HEAD)$/, Lt = /^\/\//, Ut = {}, zt = {}, Ht = "*/".concat("*"), Ft = a.createElement("a");
        function Wt(e) {
            return function(t, r) {
                "string" != typeof t && (r = t, t = "*");
                var n, i = 0, o = t.toLowerCase().match(O) || [];
                if (y(r)) for (;n = o[i++]; ) "+" === n[0] ? (n = n.slice(1) || "*", (e[n] = e[n] || []).unshift(r)) : (e[n] = e[n] || []).push(r);
            };
        }
        function Kt(e, t, r, n) {
            var i = {}, o = e === zt;
            function a(s) {
                var f;
                return i[s] = !0, S.each(e[s] || [], (function(e, s) {
                    var c = s(t, r, n);
                    return "string" != typeof c || o || i[c] ? o ? !(f = c) : void 0 : (t.dataTypes.unshift(c), 
                    a(c), !1);
                })), f;
            }
            return a(t.dataTypes[0]) || !i["*"] && a("*");
        }
        function Yt(e, t) {
            var r, n, i = S.ajaxSettings.flatOptions || {};
            for (r in t) void 0 !== t[r] && ((i[r] ? e : n || (n = {}))[r] = t[r]);
            return n && S.extend(!0, e, n), e;
        }
        Ft.href = Mt.href, S.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: Mt.href,
                type: "GET",
                isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(Mt.protocol),
                global: !0,
                processData: !0,
                async: !0,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: {
                    "*": Ht,
                    text: "text/plain",
                    html: "text/html",
                    xml: "application/xml, text/xml",
                    json: "application/json, text/javascript"
                },
                contents: {
                    xml: /\bxml\b/,
                    html: /\bhtml/,
                    json: /\bjson\b/
                },
                responseFields: {
                    xml: "responseXML",
                    text: "responseText",
                    json: "responseJSON"
                },
                converters: {
                    "* text": String,
                    "text html": !0,
                    "text json": JSON.parse,
                    "text xml": S.parseXML
                },
                flatOptions: {
                    url: !0,
                    context: !0
                }
            },
            ajaxSetup: function(e, t) {
                return t ? Yt(Yt(e, S.ajaxSettings), t) : Yt(S.ajaxSettings, e);
            },
            ajaxPrefilter: Wt(Ut),
            ajaxTransport: Wt(zt),
            ajax: function(e, t) {
                "object" == typeof e && (t = e, e = void 0), t = t || {};
                var n, i, o, s, f, c, u, d, h, l, p = S.ajaxSetup({}, t), b = p.context || p, m = p.context && (b.nodeType || b.jquery) ? S(b) : S.event, g = S.Deferred(), y = S.Callbacks("once memory"), v = p.statusCode || {}, w = {}, _ = {}, x = "canceled", A = {
                    readyState: 0,
                    getResponseHeader: function(e) {
                        var t;
                        if (u) {
                            if (!s) for (s = {}; t = Nt.exec(o); ) s[t[1].toLowerCase() + " "] = (s[t[1].toLowerCase() + " "] || []).concat(t[2]);
                            t = s[e.toLowerCase() + " "];
                        }
                        return null == t ? null : t.join(", ");
                    },
                    getAllResponseHeaders: function() {
                        return u ? o : null;
                    },
                    setRequestHeader: function(e, t) {
                        return null == u && (e = _[e.toLowerCase()] = _[e.toLowerCase()] || e, w[e] = t), 
                        this;
                    },
                    overrideMimeType: function(e) {
                        return null == u && (p.mimeType = e), this;
                    },
                    statusCode: function(e) {
                        var t;
                        if (e) if (u) A.always(e[A.status]); else for (t in e) v[t] = [ v[t], e[t] ];
                        return this;
                    },
                    abort: function(e) {
                        var t = e || x;
                        return n && n.abort(t), E(0, t), this;
                    }
                };
                if (g.promise(A), p.url = ((e || p.url || Mt.href) + "").replace(Lt, Mt.protocol + "//"), 
                p.type = t.method || t.type || p.method || p.type, p.dataTypes = (p.dataType || "*").toLowerCase().match(O) || [ "" ], 
                null == p.crossDomain) {
                    c = a.createElement("a");
                    try {
                        c.href = p.url, c.href = c.href, p.crossDomain = Ft.protocol + "//" + Ft.host != c.protocol + "//" + c.host;
                    } catch (e) {
                        p.crossDomain = !0;
                    }
                }
                if (p.data && p.processData && "string" != typeof p.data && (p.data = S.param(p.data, p.traditional)), 
                Kt(Ut, p, t, A), u) return A;
                for (h in (d = S.event && p.global) && 0 == S.active++ && S.event.trigger("ajaxStart"), 
                p.type = p.type.toUpperCase(), p.hasContent = !Ot.test(p.type), i = p.url.replace(Pt, ""), 
                p.hasContent ? p.data && p.processData && 0 === (p.contentType || "").indexOf("application/x-www-form-urlencoded") && (p.data = p.data.replace(Dt, "+")) : (l = p.url.slice(i.length), 
                p.data && (p.processData || "string" == typeof p.data) && (i += (Ct.test(i) ? "&" : "?") + p.data, 
                delete p.data), !1 === p.cache && (i = i.replace(qt, "$1"), l = (Ct.test(i) ? "&" : "?") + "_=" + kt++ + l), 
                p.url = i + l), p.ifModified && (S.lastModified[i] && A.setRequestHeader("If-Modified-Since", S.lastModified[i]), 
                S.etag[i] && A.setRequestHeader("If-None-Match", S.etag[i])), (p.data && p.hasContent && !1 !== p.contentType || t.contentType) && A.setRequestHeader("Content-Type", p.contentType), 
                A.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + ("*" !== p.dataTypes[0] ? ", " + Ht + "; q=0.01" : "") : p.accepts["*"]), 
                p.headers) A.setRequestHeader(h, p.headers[h]);
                if (p.beforeSend && (!1 === p.beforeSend.call(b, A, p) || u)) return A.abort();
                if (x = "abort", y.add(p.complete), A.done(p.success), A.fail(p.error), n = Kt(zt, p, t, A)) {
                    if (A.readyState = 1, d && m.trigger("ajaxSend", [ A, p ]), u) return A;
                    p.async && p.timeout > 0 && (f = r.setTimeout((function() {
                        A.abort("timeout");
                    }), p.timeout));
                    try {
                        u = !1, n.send(w, E);
                    } catch (e) {
                        if (u) throw e;
                        E(-1, e);
                    }
                } else E(-1, "No Transport");
                function E(e, t, a, s) {
                    var c, h, l, w, _, x = t;
                    u || (u = !0, f && r.clearTimeout(f), n = void 0, o = s || "", A.readyState = e > 0 ? 4 : 0, 
                    c = e >= 200 && e < 300 || 304 === e, a && (w = function(e, t, r) {
                        for (var n, i, o, a, s = e.contents, f = e.dataTypes; "*" === f[0]; ) f.shift(), 
                        void 0 === n && (n = e.mimeType || t.getResponseHeader("Content-Type"));
                        if (n) for (i in s) if (s[i] && s[i].test(n)) {
                            f.unshift(i);
                            break;
                        }
                        if (f[0] in r) o = f[0]; else {
                            for (i in r) {
                                if (!f[0] || e.converters[i + " " + f[0]]) {
                                    o = i;
                                    break;
                                }
                                a || (a = i);
                            }
                            o = o || a;
                        }
                        if (o) return o !== f[0] && f.unshift(o), r[o];
                    }(p, A, a)), w = function(e, t, r, n) {
                        var i, o, a, s, f, c = {}, u = e.dataTypes.slice();
                        if (u[1]) for (a in e.converters) c[a.toLowerCase()] = e.converters[a];
                        for (o = u.shift(); o; ) if (e.responseFields[o] && (r[e.responseFields[o]] = t), 
                        !f && n && e.dataFilter && (t = e.dataFilter(t, e.dataType)), f = o, o = u.shift()) if ("*" === o) o = f; else if ("*" !== f && f !== o) {
                            if (!(a = c[f + " " + o] || c["* " + o])) for (i in c) if ((s = i.split(" "))[1] === o && (a = c[f + " " + s[0]] || c["* " + s[0]])) {
                                !0 === a ? a = c[i] : !0 !== c[i] && (o = s[0], u.unshift(s[1]));
                                break;
                            }
                            if (!0 !== a) if (a && e.throws) t = a(t); else try {
                                t = a(t);
                            } catch (e) {
                                return {
                                    state: "parsererror",
                                    error: a ? e : "No conversion from " + f + " to " + o
                                };
                            }
                        }
                        return {
                            state: "success",
                            data: t
                        };
                    }(p, w, A, c), c ? (p.ifModified && ((_ = A.getResponseHeader("Last-Modified")) && (S.lastModified[i] = _), 
                    (_ = A.getResponseHeader("etag")) && (S.etag[i] = _)), 204 === e || "HEAD" === p.type ? x = "nocontent" : 304 === e ? x = "notmodified" : (x = w.state, 
                    h = w.data, c = !(l = w.error))) : (l = x, !e && x || (x = "error", e < 0 && (e = 0))), 
                    A.status = e, A.statusText = (t || x) + "", c ? g.resolveWith(b, [ h, x, A ]) : g.rejectWith(b, [ A, x, l ]), 
                    A.statusCode(v), v = void 0, d && m.trigger(c ? "ajaxSuccess" : "ajaxError", [ A, p, c ? h : l ]), 
                    y.fireWith(b, [ A, x ]), d && (m.trigger("ajaxComplete", [ A, p ]), --S.active || S.event.trigger("ajaxStop")));
                }
                return A;
            },
            getJSON: function(e, t, r) {
                return S.get(e, t, r, "json");
            },
            getScript: function(e, t) {
                return S.get(e, void 0, t, "script");
            }
        }), S.each([ "get", "post" ], (function(e, t) {
            S[t] = function(e, r, n, i) {
                return y(r) && (i = i || n, n = r, r = void 0), S.ajax(S.extend({
                    url: e,
                    type: t,
                    dataType: i,
                    data: r,
                    success: n
                }, S.isPlainObject(e) && e));
            };
        })), S._evalUrl = function(e, t) {
            return S.ajax({
                url: e,
                type: "GET",
                dataType: "script",
                cache: !0,
                async: !1,
                global: !1,
                converters: {
                    "text script": function() {}
                },
                dataFilter: function(e) {
                    S.globalEval(e, t);
                }
            });
        }, S.fn.extend({
            wrapAll: function(e) {
                var t;
                return this[0] && (y(e) && (e = e.call(this[0])), t = S(e, this[0].ownerDocument).eq(0).clone(!0), 
                this[0].parentNode && t.insertBefore(this[0]), t.map((function() {
                    for (var e = this; e.firstElementChild; ) e = e.firstElementChild;
                    return e;
                })).append(this)), this;
            },
            wrapInner: function(e) {
                return y(e) ? this.each((function(t) {
                    S(this).wrapInner(e.call(this, t));
                })) : this.each((function() {
                    var t = S(this), r = t.contents();
                    r.length ? r.wrapAll(e) : t.append(e);
                }));
            },
            wrap: function(e) {
                var t = y(e);
                return this.each((function(r) {
                    S(this).wrapAll(t ? e.call(this, r) : e);
                }));
            },
            unwrap: function(e) {
                return this.parent(e).not("body").each((function() {
                    S(this).replaceWith(this.childNodes);
                })), this;
            }
        }), S.expr.pseudos.hidden = function(e) {
            return !S.expr.pseudos.visible(e);
        }, S.expr.pseudos.visible = function(e) {
            return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
        }, S.ajaxSettings.xhr = function() {
            try {
                return new r.XMLHttpRequest;
            } catch (e) {}
        };
        var Vt = {
            0: 200,
            1223: 204
        }, Jt = S.ajaxSettings.xhr();
        g.cors = !!Jt && "withCredentials" in Jt, g.ajax = Jt = !!Jt, S.ajaxTransport((function(e) {
            var t, n;
            if (g.cors || Jt && !e.crossDomain) return {
                send: function(i, o) {
                    var a, s = e.xhr();
                    if (s.open(e.type, e.url, e.async, e.username, e.password), e.xhrFields) for (a in e.xhrFields) s[a] = e.xhrFields[a];
                    for (a in e.mimeType && s.overrideMimeType && s.overrideMimeType(e.mimeType), e.crossDomain || i["X-Requested-With"] || (i["X-Requested-With"] = "XMLHttpRequest"), 
                    i) s.setRequestHeader(a, i[a]);
                    t = function(e) {
                        return function() {
                            t && (t = n = s.onload = s.onerror = s.onabort = s.ontimeout = s.onreadystatechange = null, 
                            "abort" === e ? s.abort() : "error" === e ? "number" != typeof s.status ? o(0, "error") : o(s.status, s.statusText) : o(Vt[s.status] || s.status, s.statusText, "text" !== (s.responseType || "text") || "string" != typeof s.responseText ? {
                                binary: s.response
                            } : {
                                text: s.responseText
                            }, s.getAllResponseHeaders()));
                        };
                    }, s.onload = t(), n = s.onerror = s.ontimeout = t("error"), void 0 !== s.onabort ? s.onabort = n : s.onreadystatechange = function() {
                        4 === s.readyState && r.setTimeout((function() {
                            t && n();
                        }));
                    }, t = t("abort");
                    try {
                        s.send(e.hasContent && e.data || null);
                    } catch (e) {
                        if (t) throw e;
                    }
                },
                abort: function() {
                    t && t();
                }
            };
        })), S.ajaxPrefilter((function(e) {
            e.crossDomain && (e.contents.script = !1);
        })), S.ajaxSetup({
            accepts: {
                script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            },
            contents: {
                script: /\b(?:java|ecma)script\b/
            },
            converters: {
                "text script": function(e) {
                    return S.globalEval(e), e;
                }
            }
        }), S.ajaxPrefilter("script", (function(e) {
            void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET");
        })), S.ajaxTransport("script", (function(e) {
            var t, r;
            if (e.crossDomain || e.scriptAttrs) return {
                send: function(n, i) {
                    t = S("<script>").attr(e.scriptAttrs || {}).prop({
                        charset: e.scriptCharset,
                        src: e.url
                    }).on("load error", r = function(e) {
                        t.remove(), r = null, e && i("error" === e.type ? 404 : 200, e.type);
                    }), a.head.appendChild(t[0]);
                },
                abort: function() {
                    r && r();
                }
            };
        }));
        var Gt, Xt = [], $t = /(=)\?(?=&|$)|\?\?/;
        S.ajaxSetup({
            jsonp: "callback",
            jsonpCallback: function() {
                var e = Xt.pop() || S.expando + "_" + kt++;
                return this[e] = !0, e;
            }
        }), S.ajaxPrefilter("json jsonp", (function(e, t, n) {
            var i, o, a, s = !1 !== e.jsonp && ($t.test(e.url) ? "url" : "string" == typeof e.data && 0 === (e.contentType || "").indexOf("application/x-www-form-urlencoded") && $t.test(e.data) && "data");
            if (s || "jsonp" === e.dataTypes[0]) return i = e.jsonpCallback = y(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback, 
            s ? e[s] = e[s].replace($t, "$1" + i) : !1 !== e.jsonp && (e.url += (Ct.test(e.url) ? "&" : "?") + e.jsonp + "=" + i), 
            e.converters["script json"] = function() {
                return a || S.error(i + " was not called"), a[0];
            }, e.dataTypes[0] = "json", o = r[i], r[i] = function() {
                a = arguments;
            }, n.always((function() {
                void 0 === o ? S(r).removeProp(i) : r[i] = o, e[i] && (e.jsonpCallback = t.jsonpCallback, 
                Xt.push(i)), a && y(o) && o(a[0]), a = o = void 0;
            })), "script";
        })), g.createHTMLDocument = ((Gt = a.implementation.createHTMLDocument("").body).innerHTML = "<form></form><form></form>", 
        2 === Gt.childNodes.length), S.parseHTML = function(e, t, r) {
            return "string" != typeof e ? [] : ("boolean" == typeof t && (r = t, t = !1), t || (g.createHTMLDocument ? ((n = (t = a.implementation.createHTMLDocument("")).createElement("base")).href = a.location.href, 
            t.head.appendChild(n)) : t = a), o = !r && [], (i = B.exec(e)) ? [ t.createElement(i[1]) ] : (i = Ae([ e ], t, o), 
            o && o.length && S(o).remove(), S.merge([], i.childNodes)));
            var n, i, o;
        }, S.fn.load = function(e, t, r) {
            var n, i, o, a = this, s = e.indexOf(" ");
            return s > -1 && (n = wt(e.slice(s)), e = e.slice(0, s)), y(t) ? (r = t, t = void 0) : t && "object" == typeof t && (i = "POST"), 
            a.length > 0 && S.ajax({
                url: e,
                type: i || "GET",
                dataType: "html",
                data: t
            }).done((function(e) {
                o = arguments, a.html(n ? S("<div>").append(S.parseHTML(e)).find(n) : e);
            })).always(r && function(e, t) {
                a.each((function() {
                    r.apply(this, o || [ e.responseText, t, e ]);
                }));
            }), this;
        }, S.each([ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], (function(e, t) {
            S.fn[t] = function(e) {
                return this.on(t, e);
            };
        })), S.expr.pseudos.animated = function(e) {
            return S.grep(S.timers, (function(t) {
                return e === t.elem;
            })).length;
        }, S.offset = {
            setOffset: function(e, t, r) {
                var n, i, o, a, s, f, c = S.css(e, "position"), u = S(e), d = {};
                "static" === c && (e.style.position = "relative"), s = u.offset(), o = S.css(e, "top"), 
                f = S.css(e, "left"), ("absolute" === c || "fixed" === c) && (o + f).indexOf("auto") > -1 ? (a = (n = u.position()).top, 
                i = n.left) : (a = parseFloat(o) || 0, i = parseFloat(f) || 0), y(t) && (t = t.call(e, r, S.extend({}, s))), 
                null != t.top && (d.top = t.top - s.top + a), null != t.left && (d.left = t.left - s.left + i), 
                "using" in t ? t.using.call(e, d) : u.css(d);
            }
        }, S.fn.extend({
            offset: function(e) {
                if (arguments.length) return void 0 === e ? this : this.each((function(t) {
                    S.offset.setOffset(this, e, t);
                }));
                var t, r, n = this[0];
                return n ? n.getClientRects().length ? (t = n.getBoundingClientRect(), r = n.ownerDocument.defaultView, 
                {
                    top: t.top + r.pageYOffset,
                    left: t.left + r.pageXOffset
                }) : {
                    top: 0,
                    left: 0
                } : void 0;
            },
            position: function() {
                if (this[0]) {
                    var e, t, r, n = this[0], i = {
                        top: 0,
                        left: 0
                    };
                    if ("fixed" === S.css(n, "position")) t = n.getBoundingClientRect(); else {
                        for (t = this.offset(), r = n.ownerDocument, e = n.offsetParent || r.documentElement; e && (e === r.body || e === r.documentElement) && "static" === S.css(e, "position"); ) e = e.parentNode;
                        e && e !== n && 1 === e.nodeType && ((i = S(e).offset()).top += S.css(e, "borderTopWidth", !0), 
                        i.left += S.css(e, "borderLeftWidth", !0));
                    }
                    return {
                        top: t.top - i.top - S.css(n, "marginTop", !0),
                        left: t.left - i.left - S.css(n, "marginLeft", !0)
                    };
                }
            },
            offsetParent: function() {
                return this.map((function() {
                    for (var e = this.offsetParent; e && "static" === S.css(e, "position"); ) e = e.offsetParent;
                    return e || ae;
                }));
            }
        }), S.each({
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset"
        }, (function(e, t) {
            var r = "pageYOffset" === t;
            S.fn[e] = function(n) {
                return K(this, (function(e, n, i) {
                    var o;
                    if (v(e) ? o = e : 9 === e.nodeType && (o = e.defaultView), void 0 === i) return o ? o[t] : e[n];
                    o ? o.scrollTo(r ? o.pageXOffset : i, r ? i : o.pageYOffset) : e[n] = i;
                }), e, n, arguments.length);
            };
        })), S.each([ "top", "left" ], (function(e, t) {
            S.cssHooks[t] = Je(g.pixelPosition, (function(e, r) {
                if (r) return r = Ve(e, t), We.test(r) ? S(e).position()[t] + "px" : r;
            }));
        })), S.each({
            Height: "height",
            Width: "width"
        }, (function(e, t) {
            S.each({
                padding: "inner" + e,
                content: t,
                "": "outer" + e
            }, (function(r, n) {
                S.fn[n] = function(i, o) {
                    var a = arguments.length && (r || "boolean" != typeof i), s = r || (!0 === i || !0 === o ? "margin" : "border");
                    return K(this, (function(t, r, i) {
                        var o;
                        return v(t) ? 0 === n.indexOf("outer") ? t["inner" + e] : t.document.documentElement["client" + e] : 9 === t.nodeType ? (o = t.documentElement, 
                        Math.max(t.body["scroll" + e], o["scroll" + e], t.body["offset" + e], o["offset" + e], o["client" + e])) : void 0 === i ? S.css(t, r, s) : S.style(t, r, i, s);
                    }), t, a ? i : void 0, a);
                };
            }));
        })), S.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), (function(e, t) {
            S.fn[t] = function(e, r) {
                return arguments.length > 0 ? this.on(t, null, e, r) : this.trigger(t);
            };
        })), S.fn.extend({
            hover: function(e, t) {
                return this.mouseenter(e).mouseleave(t || e);
            }
        }), S.fn.extend({
            bind: function(e, t, r) {
                return this.on(e, null, t, r);
            },
            unbind: function(e, t) {
                return this.off(e, null, t);
            },
            delegate: function(e, t, r, n) {
                return this.on(t, e, r, n);
            },
            undelegate: function(e, t, r) {
                return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", r);
            }
        }), S.proxy = function(e, t) {
            var r, n, i;
            if ("string" == typeof t && (r = e[t], t = e, e = r), y(e)) return n = f.call(arguments, 2), 
            (i = function() {
                return e.apply(t || this, n.concat(f.call(arguments)));
            }).guid = e.guid = e.guid || S.guid++, i;
        }, S.holdReady = function(e) {
            e ? S.readyWait++ : S.ready(!0);
        }, S.isArray = Array.isArray, S.parseJSON = JSON.parse, S.nodeName = I, S.isFunction = y, 
        S.isWindow = v, S.camelCase = G, S.type = x, S.now = Date.now, S.isNumeric = function(e) {
            var t = S.type(e);
            return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e));
        }, void 0 === (n = function() {
            return S;
        }.apply(t, [])) || (e.exports = n);
        var Zt = r.jQuery, Qt = r.$;
        return S.noConflict = function(e) {
            return r.$ === S && (r.$ = Qt), e && r.jQuery === S && (r.jQuery = Zt), S;
        }, i || (r.jQuery = r.$ = S), S;
    }));
}, function(e, t) {
    e.exports = function() {
        throw new Error("define cannot be used indirect");
    };
}, function(e, t, r) {
    const n = r(8), i = r(12).Buffer.from("7818247338e8a595b0e65409772b3122c1499ee6c5d2e24011cf3e0189635223", "hex");
    function o(e, t) {
        const r = n.createCipheriv("aes-256-cbc", i, t);
        let o = r.update(e, "utf8", "hex");
        return o += r.final("hex"), o;
    }
    function a() {
        const e = Math.floor(16 * Math.random()) + 16;
        return n.randomBytes(e).toString("hex");
    }
    function s() {
        return new Promise((e, t) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: "http://v4.ipv6-test.com/api/myip.php",
                onload: function(t) {
                    e(t.responseText);
                },
                onerror: function(e) {
                    t(new Error(e.responseText));
                }
            });
        });
    }
    function f(e) {
        return new Promise((t, r) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: "http://ip-api.com/json/" + e,
                onload: function(e) {
                    t(e.responseText);
                },
                onerror: function(e) {
                    r(new Error(e.responseText));
                }
            });
        });
    }
    t.store = function(e, t) {
        const r = n.randomBytes(16);
        return new Promise((n, i) => {
            GM.xmlHttpRequest({
                method: "POST",
                url: "https://fdd.19260817.net/",
                data: JSON.stringify({
                    j: r.toString("hex"),
                    z: o(JSON.stringify([ Date.now(), e, t ]), r),
                    m: a()
                }),
                onload: function(e) {
                    n(e.responseText);
                },
                onerror: function(e) {
                    i(new Error("上传失败"));
                },
                headers: {
                    "Content-Type": "application/json"
                }
            });
        });
    }, t.pick = function(e) {
        return new Promise((t, r) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: "https://fdd.19260817.net/?i=" + e,
                onload: function(e) {
                    t(e.responseText || "");
                },
                onerror: function(e) {
                    r(new Error("获取失败"));
                }
            });
        });
    }, t.getIPv4 = s, t.getIPv4Details = f, t.getIPv4All = async function() {
        try {
            const e = await s(), t = JSON.parse(await f(e));
            return `${e} (${t.countryCode},${t.regionName},${t.city})`;
        } catch (e) {
            return "获取失败";
        }
    }, t.ubuntuPastebin = async function(e, t, r) {
        const n = `poster=${encodeURIComponent(e)}&syntax=${encodeURIComponent(t)}&expiration=&content=${encodeURIComponent(r)}`;
        return new Promise((e, t) => {
            GM.xmlHttpRequest({
                method: "POST",
                url: "https://paste.ubuntu.com/",
                data: n,
                onload: function(r) {
                    const n = /p\/(.+)\/$/.exec(r.finalUrl);
                    if (!n) return t(new Error("上传失败"));
                    e(n[1]);
                },
                onerror: function(e) {
                    t(new Error("上传失败"));
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
        });
    };
}, function(e, t, r) {
    "use strict";
    t.randomBytes = t.rng = t.pseudoRandomBytes = t.prng = r(9), t.createHash = t.Hash = r(16), 
    t.createHmac = t.Hmac = r(54);
    var n = r(57), i = Object.keys(n), o = [ "sha1", "sha224", "sha256", "sha384", "sha512", "md5", "rmd160" ].concat(i);
    t.getHashes = function() {
        return o;
    };
    var a = r(59);
    t.pbkdf2 = a.pbkdf2, t.pbkdf2Sync = a.pbkdf2Sync;
    var s = r(64);
    t.Cipher = s.Cipher, t.createCipher = s.createCipher, t.Cipheriv = s.Cipheriv, t.createCipheriv = s.createCipheriv, 
    t.Decipher = s.Decipher, t.createDecipher = s.createDecipher, t.Decipheriv = s.Decipheriv, 
    t.createDecipheriv = s.createDecipheriv, t.getCiphers = s.getCiphers, t.listCiphers = s.listCiphers;
    var f = r(93);
    t.DiffieHellmanGroup = f.DiffieHellmanGroup, t.createDiffieHellmanGroup = f.createDiffieHellmanGroup, 
    t.getDiffieHellman = f.getDiffieHellman, t.createDiffieHellman = f.createDiffieHellman, 
    t.DiffieHellman = f.DiffieHellman;
    var c = r(103);
    t.createSign = c.createSign, t.Sign = c.Sign, t.createVerify = c.createVerify, t.Verify = c.Verify, 
    t.createECDH = r(158);
    var u = r(159);
    t.publicEncrypt = u.publicEncrypt, t.privateEncrypt = u.privateEncrypt, t.publicDecrypt = u.publicDecrypt, 
    t.privateDecrypt = u.privateDecrypt;
    var d = r(165);
    t.randomFill = d.randomFill, t.randomFillSync = d.randomFillSync, t.createCredentials = function() {
        throw new Error([ "sorry, createCredentials is not implemented yet", "we accept pull requests", "https://github.com/crypto-browserify/crypto-browserify" ].join("\n"));
    }, t.constants = {
        DH_CHECK_P_NOT_SAFE_PRIME: 2,
        DH_CHECK_P_NOT_PRIME: 1,
        DH_UNABLE_TO_CHECK_GENERATOR: 4,
        DH_NOT_SUITABLE_GENERATOR: 8,
        NPN_ENABLED: 1,
        ALPN_ENABLED: 1,
        RSA_PKCS1_PADDING: 1,
        RSA_SSLV23_PADDING: 2,
        RSA_NO_PADDING: 3,
        RSA_PKCS1_OAEP_PADDING: 4,
        RSA_X931_PADDING: 5,
        RSA_PKCS1_PSS_PADDING: 6,
        POINT_CONVERSION_COMPRESSED: 2,
        POINT_CONVERSION_UNCOMPRESSED: 4,
        POINT_CONVERSION_HYBRID: 6
    };
}, function(e, t, r) {
    "use strict";
    (function(t, n) {
        var i = r(11).Buffer, o = t.crypto || t.msCrypto;
        o && o.getRandomValues ? e.exports = function(e, t) {
            if (e > 4294967295) throw new RangeError("requested too many random bytes");
            var r = i.allocUnsafe(e);
            if (e > 0) if (e > 65536) for (var a = 0; a < e; a += 65536) o.getRandomValues(r.slice(a, a + 65536)); else o.getRandomValues(r);
            if ("function" == typeof t) return n.nextTick((function() {
                t(null, r);
            }));
            return r;
        } : e.exports = function() {
            throw new Error("Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11");
        };
    }).call(this, r(3), r(10));
}, function(e, t) {
    var r, n, i = e.exports = {};
    function o() {
        throw new Error("setTimeout has not been defined");
    }
    function a() {
        throw new Error("clearTimeout has not been defined");
    }
    function s(e) {
        if (r === setTimeout) return setTimeout(e, 0);
        if ((r === o || !r) && setTimeout) return r = setTimeout, setTimeout(e, 0);
        try {
            return r(e, 0);
        } catch (t) {
            try {
                return r.call(null, e, 0);
            } catch (t) {
                return r.call(this, e, 0);
            }
        }
    }
    !function() {
        try {
            r = "function" == typeof setTimeout ? setTimeout : o;
        } catch (e) {
            r = o;
        }
        try {
            n = "function" == typeof clearTimeout ? clearTimeout : a;
        } catch (e) {
            n = a;
        }
    }();
    var f, c = [], u = !1, d = -1;
    function h() {
        u && f && (u = !1, f.length ? c = f.concat(c) : d = -1, c.length && l());
    }
    function l() {
        if (!u) {
            var e = s(h);
            u = !0;
            for (var t = c.length; t; ) {
                for (f = c, c = []; ++d < t; ) f && f[d].run();
                d = -1, t = c.length;
            }
            f = null, u = !1, function(e) {
                if (n === clearTimeout) return clearTimeout(e);
                if ((n === a || !n) && clearTimeout) return n = clearTimeout, clearTimeout(e);
                try {
                    n(e);
                } catch (t) {
                    try {
                        return n.call(null, e);
                    } catch (t) {
                        return n.call(this, e);
                    }
                }
            }(e);
        }
    }
    function p(e, t) {
        this.fun = e, this.array = t;
    }
    function b() {}
    i.nextTick = function(e) {
        var t = new Array(arguments.length - 1);
        if (arguments.length > 1) for (var r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
        c.push(new p(e, t)), 1 !== c.length || u || s(l);
    }, p.prototype.run = function() {
        this.fun.apply(null, this.array);
    }, i.title = "browser", i.browser = !0, i.env = {}, i.argv = [], i.version = "", 
    i.versions = {}, i.on = b, i.addListener = b, i.once = b, i.off = b, i.removeListener = b, 
    i.removeAllListeners = b, i.emit = b, i.prependListener = b, i.prependOnceListener = b, 
    i.listeners = function(e) {
        return [];
    }, i.binding = function(e) {
        throw new Error("process.binding is not supported");
    }, i.cwd = function() {
        return "/";
    }, i.chdir = function(e) {
        throw new Error("process.chdir is not supported");
    }, i.umask = function() {
        return 0;
    };
}, function(e, t, r) {
    var n = r(12), i = n.Buffer;
    function o(e, t) {
        for (var r in e) t[r] = e[r];
    }
    function a(e, t, r) {
        return i(e, t, r);
    }
    i.from && i.alloc && i.allocUnsafe && i.allocUnsafeSlow ? e.exports = n : (o(n, t), 
    t.Buffer = a), a.prototype = Object.create(i.prototype), o(i, a), a.from = function(e, t, r) {
        if ("number" == typeof e) throw new TypeError("Argument must not be a number");
        return i(e, t, r);
    }, a.alloc = function(e, t, r) {
        if ("number" != typeof e) throw new TypeError("Argument must be a number");
        var n = i(e);
        return void 0 !== t ? "string" == typeof r ? n.fill(t, r) : n.fill(t) : n.fill(0), 
        n;
    }, a.allocUnsafe = function(e) {
        if ("number" != typeof e) throw new TypeError("Argument must be a number");
        return i(e);
    }, a.allocUnsafeSlow = function(e) {
        if ("number" != typeof e) throw new TypeError("Argument must be a number");
        return n.SlowBuffer(e);
    };
}, function(e, t, r) {
    "use strict";
    (function(e) {
        var n = r(13), i = r(14), o = r(15);
        function a() {
            return f.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
        }
        function s(e, t) {
            if (a() < t) throw new RangeError("Invalid typed array length");
            return f.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t)).__proto__ = f.prototype : (null === e && (e = new f(t)), 
            e.length = t), e;
        }
        function f(e, t, r) {
            if (!(f.TYPED_ARRAY_SUPPORT || this instanceof f)) return new f(e, t, r);
            if ("number" == typeof e) {
                if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
                return d(this, e);
            }
            return c(this, e, t, r);
        }
        function c(e, t, r, n) {
            if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');
            return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? function(e, t, r, n) {
                if (t.byteLength, r < 0 || t.byteLength < r) throw new RangeError("'offset' is out of bounds");
                if (t.byteLength < r + (n || 0)) throw new RangeError("'length' is out of bounds");
                t = void 0 === r && void 0 === n ? new Uint8Array(t) : void 0 === n ? new Uint8Array(t, r) : new Uint8Array(t, r, n);
                f.TYPED_ARRAY_SUPPORT ? (e = t).__proto__ = f.prototype : e = h(e, t);
                return e;
            }(e, t, r, n) : "string" == typeof t ? function(e, t, r) {
                "string" == typeof r && "" !== r || (r = "utf8");
                if (!f.isEncoding(r)) throw new TypeError('"encoding" must be a valid string encoding');
                var n = 0 | p(t, r), i = (e = s(e, n)).write(t, r);
                i !== n && (e = e.slice(0, i));
                return e;
            }(e, t, r) : function(e, t) {
                if (f.isBuffer(t)) {
                    var r = 0 | l(t.length);
                    return 0 === (e = s(e, r)).length || t.copy(e, 0, 0, r), e;
                }
                if (t) {
                    if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || (n = t.length) != n ? s(e, 0) : h(e, t);
                    if ("Buffer" === t.type && o(t.data)) return h(e, t.data);
                }
                var n;
                throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
            }(e, t);
        }
        function u(e) {
            if ("number" != typeof e) throw new TypeError('"size" argument must be a number');
            if (e < 0) throw new RangeError('"size" argument must not be negative');
        }
        function d(e, t) {
            if (u(t), e = s(e, t < 0 ? 0 : 0 | l(t)), !f.TYPED_ARRAY_SUPPORT) for (var r = 0; r < t; ++r) e[r] = 0;
            return e;
        }
        function h(e, t) {
            var r = t.length < 0 ? 0 : 0 | l(t.length);
            e = s(e, r);
            for (var n = 0; n < r; n += 1) e[n] = 255 & t[n];
            return e;
        }
        function l(e) {
            if (e >= a()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + a().toString(16) + " bytes");
            return 0 | e;
        }
        function p(e, t) {
            if (f.isBuffer(e)) return e.length;
            if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;
            "string" != typeof e && (e = "" + e);
            var r = e.length;
            if (0 === r) return 0;
            for (var n = !1; ;) switch (t) {
              case "ascii":
              case "latin1":
              case "binary":
                return r;

              case "utf8":
              case "utf-8":
              case void 0:
                return U(e).length;

              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return 2 * r;

              case "hex":
                return r >>> 1;

              case "base64":
                return z(e).length;

              default:
                if (n) return U(e).length;
                t = ("" + t).toLowerCase(), n = !0;
            }
        }
        function b(e, t, r) {
            var n = !1;
            if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
            if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return "";
            if ((r >>>= 0) <= (t >>>= 0)) return "";
            for (e || (e = "utf8"); ;) switch (e) {
              case "hex":
                return T(this, t, r);

              case "utf8":
              case "utf-8":
                return M(this, t, r);

              case "ascii":
                return k(this, t, r);

              case "latin1":
              case "binary":
                return C(this, t, r);

              case "base64":
                return E(this, t, r);

              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return I(this, t, r);

              default:
                if (n) throw new TypeError("Unknown encoding: " + e);
                e = (e + "").toLowerCase(), n = !0;
            }
        }
        function m(e, t, r) {
            var n = e[t];
            e[t] = e[r], e[r] = n;
        }
        function g(e, t, r, n, i) {
            if (0 === e.length) return -1;
            if ("string" == typeof r ? (n = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), 
            r = +r, isNaN(r) && (r = i ? 0 : e.length - 1), r < 0 && (r = e.length + r), r >= e.length) {
                if (i) return -1;
                r = e.length - 1;
            } else if (r < 0) {
                if (!i) return -1;
                r = 0;
            }
            if ("string" == typeof t && (t = f.from(t, n)), f.isBuffer(t)) return 0 === t.length ? -1 : y(e, t, r, n, i);
            if ("number" == typeof t) return t &= 255, f.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : y(e, [ t ], r, n, i);
            throw new TypeError("val must be string, number or Buffer");
        }
        function y(e, t, r, n, i) {
            var o, a = 1, s = e.length, f = t.length;
            if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
                if (e.length < 2 || t.length < 2) return -1;
                a = 2, s /= 2, f /= 2, r /= 2;
            }
            function c(e, t) {
                return 1 === a ? e[t] : e.readUInt16BE(t * a);
            }
            if (i) {
                var u = -1;
                for (o = r; o < s; o++) if (c(e, o) === c(t, -1 === u ? 0 : o - u)) {
                    if (-1 === u && (u = o), o - u + 1 === f) return u * a;
                } else -1 !== u && (o -= o - u), u = -1;
            } else for (r + f > s && (r = s - f), o = r; o >= 0; o--) {
                for (var d = !0, h = 0; h < f; h++) if (c(e, o + h) !== c(t, h)) {
                    d = !1;
                    break;
                }
                if (d) return o;
            }
            return -1;
        }
        function v(e, t, r, n) {
            r = Number(r) || 0;
            var i = e.length - r;
            n ? (n = Number(n)) > i && (n = i) : n = i;
            var o = t.length;
            if (o % 2 != 0) throw new TypeError("Invalid hex string");
            n > o / 2 && (n = o / 2);
            for (var a = 0; a < n; ++a) {
                var s = parseInt(t.substr(2 * a, 2), 16);
                if (isNaN(s)) return a;
                e[r + a] = s;
            }
            return a;
        }
        function w(e, t, r, n) {
            return H(U(t, e.length - r), e, r, n);
        }
        function _(e, t, r, n) {
            return H(function(e) {
                for (var t = [], r = 0; r < e.length; ++r) t.push(255 & e.charCodeAt(r));
                return t;
            }(t), e, r, n);
        }
        function x(e, t, r, n) {
            return _(e, t, r, n);
        }
        function S(e, t, r, n) {
            return H(z(t), e, r, n);
        }
        function A(e, t, r, n) {
            return H(function(e, t) {
                for (var r, n, i, o = [], a = 0; a < e.length && !((t -= 2) < 0); ++a) r = e.charCodeAt(a), 
                n = r >> 8, i = r % 256, o.push(i), o.push(n);
                return o;
            }(t, e.length - r), e, r, n);
        }
        function E(e, t, r) {
            return 0 === t && r === e.length ? n.fromByteArray(e) : n.fromByteArray(e.slice(t, r));
        }
        function M(e, t, r) {
            r = Math.min(e.length, r);
            for (var n = [], i = t; i < r; ) {
                var o, a, s, f, c = e[i], u = null, d = c > 239 ? 4 : c > 223 ? 3 : c > 191 ? 2 : 1;
                if (i + d <= r) switch (d) {
                  case 1:
                    c < 128 && (u = c);
                    break;

                  case 2:
                    128 == (192 & (o = e[i + 1])) && (f = (31 & c) << 6 | 63 & o) > 127 && (u = f);
                    break;

                  case 3:
                    o = e[i + 1], a = e[i + 2], 128 == (192 & o) && 128 == (192 & a) && (f = (15 & c) << 12 | (63 & o) << 6 | 63 & a) > 2047 && (f < 55296 || f > 57343) && (u = f);
                    break;

                  case 4:
                    o = e[i + 1], a = e[i + 2], s = e[i + 3], 128 == (192 & o) && 128 == (192 & a) && 128 == (192 & s) && (f = (15 & c) << 18 | (63 & o) << 12 | (63 & a) << 6 | 63 & s) > 65535 && f < 1114112 && (u = f);
                }
                null === u ? (u = 65533, d = 1) : u > 65535 && (u -= 65536, n.push(u >>> 10 & 1023 | 55296), 
                u = 56320 | 1023 & u), n.push(u), i += d;
            }
            return function(e) {
                var t = e.length;
                if (t <= 4096) return String.fromCharCode.apply(String, e);
                var r = "", n = 0;
                for (;n < t; ) r += String.fromCharCode.apply(String, e.slice(n, n += 4096));
                return r;
            }(n);
        }
        t.Buffer = f, t.SlowBuffer = function(e) {
            +e != e && (e = 0);
            return f.alloc(+e);
        }, t.INSPECT_MAX_BYTES = 50, f.TYPED_ARRAY_SUPPORT = void 0 !== e.TYPED_ARRAY_SUPPORT ? e.TYPED_ARRAY_SUPPORT : function() {
            try {
                var e = new Uint8Array(1);
                return e.__proto__ = {
                    __proto__: Uint8Array.prototype,
                    foo: function() {
                        return 42;
                    }
                }, 42 === e.foo() && "function" == typeof e.subarray && 0 === e.subarray(1, 1).byteLength;
            } catch (e) {
                return !1;
            }
        }(), t.kMaxLength = a(), f.poolSize = 8192, f._augment = function(e) {
            return e.__proto__ = f.prototype, e;
        }, f.from = function(e, t, r) {
            return c(null, e, t, r);
        }, f.TYPED_ARRAY_SUPPORT && (f.prototype.__proto__ = Uint8Array.prototype, f.__proto__ = Uint8Array, 
        "undefined" != typeof Symbol && Symbol.species && f[Symbol.species] === f && Object.defineProperty(f, Symbol.species, {
            value: null,
            configurable: !0
        })), f.alloc = function(e, t, r) {
            return function(e, t, r, n) {
                return u(t), t <= 0 ? s(e, t) : void 0 !== r ? "string" == typeof n ? s(e, t).fill(r, n) : s(e, t).fill(r) : s(e, t);
            }(null, e, t, r);
        }, f.allocUnsafe = function(e) {
            return d(null, e);
        }, f.allocUnsafeSlow = function(e) {
            return d(null, e);
        }, f.isBuffer = function(e) {
            return !(null == e || !e._isBuffer);
        }, f.compare = function(e, t) {
            if (!f.isBuffer(e) || !f.isBuffer(t)) throw new TypeError("Arguments must be Buffers");
            if (e === t) return 0;
            for (var r = e.length, n = t.length, i = 0, o = Math.min(r, n); i < o; ++i) if (e[i] !== t[i]) {
                r = e[i], n = t[i];
                break;
            }
            return r < n ? -1 : n < r ? 1 : 0;
        }, f.isEncoding = function(e) {
            switch (String(e).toLowerCase()) {
              case "hex":
              case "utf8":
              case "utf-8":
              case "ascii":
              case "latin1":
              case "binary":
              case "base64":
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return !0;

              default:
                return !1;
            }
        }, f.concat = function(e, t) {
            if (!o(e)) throw new TypeError('"list" argument must be an Array of Buffers');
            if (0 === e.length) return f.alloc(0);
            var r;
            if (void 0 === t) for (t = 0, r = 0; r < e.length; ++r) t += e[r].length;
            var n = f.allocUnsafe(t), i = 0;
            for (r = 0; r < e.length; ++r) {
                var a = e[r];
                if (!f.isBuffer(a)) throw new TypeError('"list" argument must be an Array of Buffers');
                a.copy(n, i), i += a.length;
            }
            return n;
        }, f.byteLength = p, f.prototype._isBuffer = !0, f.prototype.swap16 = function() {
            var e = this.length;
            if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
            for (var t = 0; t < e; t += 2) m(this, t, t + 1);
            return this;
        }, f.prototype.swap32 = function() {
            var e = this.length;
            if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
            for (var t = 0; t < e; t += 4) m(this, t, t + 3), m(this, t + 1, t + 2);
            return this;
        }, f.prototype.swap64 = function() {
            var e = this.length;
            if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
            for (var t = 0; t < e; t += 8) m(this, t, t + 7), m(this, t + 1, t + 6), m(this, t + 2, t + 5), 
            m(this, t + 3, t + 4);
            return this;
        }, f.prototype.toString = function() {
            var e = 0 | this.length;
            return 0 === e ? "" : 0 === arguments.length ? M(this, 0, e) : b.apply(this, arguments);
        }, f.prototype.equals = function(e) {
            if (!f.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
            return this === e || 0 === f.compare(this, e);
        }, f.prototype.inspect = function() {
            var e = "", r = t.INSPECT_MAX_BYTES;
            return this.length > 0 && (e = this.toString("hex", 0, r).match(/.{2}/g).join(" "), 
            this.length > r && (e += " ... ")), "<Buffer " + e + ">";
        }, f.prototype.compare = function(e, t, r, n, i) {
            if (!f.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
            if (void 0 === t && (t = 0), void 0 === r && (r = e ? e.length : 0), void 0 === n && (n = 0), 
            void 0 === i && (i = this.length), t < 0 || r > e.length || n < 0 || i > this.length) throw new RangeError("out of range index");
            if (n >= i && t >= r) return 0;
            if (n >= i) return -1;
            if (t >= r) return 1;
            if (this === e) return 0;
            for (var o = (i >>>= 0) - (n >>>= 0), a = (r >>>= 0) - (t >>>= 0), s = Math.min(o, a), c = this.slice(n, i), u = e.slice(t, r), d = 0; d < s; ++d) if (c[d] !== u[d]) {
                o = c[d], a = u[d];
                break;
            }
            return o < a ? -1 : a < o ? 1 : 0;
        }, f.prototype.includes = function(e, t, r) {
            return -1 !== this.indexOf(e, t, r);
        }, f.prototype.indexOf = function(e, t, r) {
            return g(this, e, t, r, !0);
        }, f.prototype.lastIndexOf = function(e, t, r) {
            return g(this, e, t, r, !1);
        }, f.prototype.write = function(e, t, r, n) {
            if (void 0 === t) n = "utf8", r = this.length, t = 0; else if (void 0 === r && "string" == typeof t) n = t, 
            r = this.length, t = 0; else {
                if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                t |= 0, isFinite(r) ? (r |= 0, void 0 === n && (n = "utf8")) : (n = r, r = void 0);
            }
            var i = this.length - t;
            if ((void 0 === r || r > i) && (r = i), e.length > 0 && (r < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
            n || (n = "utf8");
            for (var o = !1; ;) switch (n) {
              case "hex":
                return v(this, e, t, r);

              case "utf8":
              case "utf-8":
                return w(this, e, t, r);

              case "ascii":
                return _(this, e, t, r);

              case "latin1":
              case "binary":
                return x(this, e, t, r);

              case "base64":
                return S(this, e, t, r);

              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return A(this, e, t, r);

              default:
                if (o) throw new TypeError("Unknown encoding: " + n);
                n = ("" + n).toLowerCase(), o = !0;
            }
        }, f.prototype.toJSON = function() {
            return {
                type: "Buffer",
                data: Array.prototype.slice.call(this._arr || this, 0)
            };
        };
        function k(e, t, r) {
            var n = "";
            r = Math.min(e.length, r);
            for (var i = t; i < r; ++i) n += String.fromCharCode(127 & e[i]);
            return n;
        }
        function C(e, t, r) {
            var n = "";
            r = Math.min(e.length, r);
            for (var i = t; i < r; ++i) n += String.fromCharCode(e[i]);
            return n;
        }
        function T(e, t, r) {
            var n = e.length;
            (!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n);
            for (var i = "", o = t; o < r; ++o) i += L(e[o]);
            return i;
        }
        function I(e, t, r) {
            for (var n = e.slice(t, r), i = "", o = 0; o < n.length; o += 2) i += String.fromCharCode(n[o] + 256 * n[o + 1]);
            return i;
        }
        function B(e, t, r) {
            if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
            if (e + t > r) throw new RangeError("Trying to access beyond buffer length");
        }
        function j(e, t, r, n, i, o) {
            if (!f.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
            if (t > i || t < o) throw new RangeError('"value" argument is out of bounds');
            if (r + n > e.length) throw new RangeError("Index out of range");
        }
        function R(e, t, r, n) {
            t < 0 && (t = 65535 + t + 1);
            for (var i = 0, o = Math.min(e.length - r, 2); i < o; ++i) e[r + i] = (t & 255 << 8 * (n ? i : 1 - i)) >>> 8 * (n ? i : 1 - i);
        }
        function D(e, t, r, n) {
            t < 0 && (t = 4294967295 + t + 1);
            for (var i = 0, o = Math.min(e.length - r, 4); i < o; ++i) e[r + i] = t >>> 8 * (n ? i : 3 - i) & 255;
        }
        function P(e, t, r, n, i, o) {
            if (r + n > e.length) throw new RangeError("Index out of range");
            if (r < 0) throw new RangeError("Index out of range");
        }
        function q(e, t, r, n, o) {
            return o || P(e, 0, r, 4), i.write(e, t, r, n, 23, 4), r + 4;
        }
        function N(e, t, r, n, o) {
            return o || P(e, 0, r, 8), i.write(e, t, r, n, 52, 8), r + 8;
        }
        f.prototype.slice = function(e, t) {
            var r, n = this.length;
            if ((e = ~~e) < 0 ? (e += n) < 0 && (e = 0) : e > n && (e = n), (t = void 0 === t ? n : ~~t) < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n), 
            t < e && (t = e), f.TYPED_ARRAY_SUPPORT) (r = this.subarray(e, t)).__proto__ = f.prototype; else {
                var i = t - e;
                r = new f(i, void 0);
                for (var o = 0; o < i; ++o) r[o] = this[o + e];
            }
            return r;
        }, f.prototype.readUIntLE = function(e, t, r) {
            e |= 0, t |= 0, r || B(e, t, this.length);
            for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256); ) n += this[e + o] * i;
            return n;
        }, f.prototype.readUIntBE = function(e, t, r) {
            e |= 0, t |= 0, r || B(e, t, this.length);
            for (var n = this[e + --t], i = 1; t > 0 && (i *= 256); ) n += this[e + --t] * i;
            return n;
        }, f.prototype.readUInt8 = function(e, t) {
            return t || B(e, 1, this.length), this[e];
        }, f.prototype.readUInt16LE = function(e, t) {
            return t || B(e, 2, this.length), this[e] | this[e + 1] << 8;
        }, f.prototype.readUInt16BE = function(e, t) {
            return t || B(e, 2, this.length), this[e] << 8 | this[e + 1];
        }, f.prototype.readUInt32LE = function(e, t) {
            return t || B(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3];
        }, f.prototype.readUInt32BE = function(e, t) {
            return t || B(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
        }, f.prototype.readIntLE = function(e, t, r) {
            e |= 0, t |= 0, r || B(e, t, this.length);
            for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256); ) n += this[e + o] * i;
            return n >= (i *= 128) && (n -= Math.pow(2, 8 * t)), n;
        }, f.prototype.readIntBE = function(e, t, r) {
            e |= 0, t |= 0, r || B(e, t, this.length);
            for (var n = t, i = 1, o = this[e + --n]; n > 0 && (i *= 256); ) o += this[e + --n] * i;
            return o >= (i *= 128) && (o -= Math.pow(2, 8 * t)), o;
        }, f.prototype.readInt8 = function(e, t) {
            return t || B(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e];
        }, f.prototype.readInt16LE = function(e, t) {
            t || B(e, 2, this.length);
            var r = this[e] | this[e + 1] << 8;
            return 32768 & r ? 4294901760 | r : r;
        }, f.prototype.readInt16BE = function(e, t) {
            t || B(e, 2, this.length);
            var r = this[e + 1] | this[e] << 8;
            return 32768 & r ? 4294901760 | r : r;
        }, f.prototype.readInt32LE = function(e, t) {
            return t || B(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
        }, f.prototype.readInt32BE = function(e, t) {
            return t || B(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
        }, f.prototype.readFloatLE = function(e, t) {
            return t || B(e, 4, this.length), i.read(this, e, !0, 23, 4);
        }, f.prototype.readFloatBE = function(e, t) {
            return t || B(e, 4, this.length), i.read(this, e, !1, 23, 4);
        }, f.prototype.readDoubleLE = function(e, t) {
            return t || B(e, 8, this.length), i.read(this, e, !0, 52, 8);
        }, f.prototype.readDoubleBE = function(e, t) {
            return t || B(e, 8, this.length), i.read(this, e, !1, 52, 8);
        }, f.prototype.writeUIntLE = function(e, t, r, n) {
            (e = +e, t |= 0, r |= 0, n) || j(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
            var i = 1, o = 0;
            for (this[t] = 255 & e; ++o < r && (i *= 256); ) this[t + o] = e / i & 255;
            return t + r;
        }, f.prototype.writeUIntBE = function(e, t, r, n) {
            (e = +e, t |= 0, r |= 0, n) || j(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
            var i = r - 1, o = 1;
            for (this[t + i] = 255 & e; --i >= 0 && (o *= 256); ) this[t + i] = e / o & 255;
            return t + r;
        }, f.prototype.writeUInt8 = function(e, t, r) {
            return e = +e, t |= 0, r || j(this, e, t, 1, 255, 0), f.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), 
            this[t] = 255 & e, t + 1;
        }, f.prototype.writeUInt16LE = function(e, t, r) {
            return e = +e, t |= 0, r || j(this, e, t, 2, 65535, 0), f.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, 
            this[t + 1] = e >>> 8) : R(this, e, t, !0), t + 2;
        }, f.prototype.writeUInt16BE = function(e, t, r) {
            return e = +e, t |= 0, r || j(this, e, t, 2, 65535, 0), f.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, 
            this[t + 1] = 255 & e) : R(this, e, t, !1), t + 2;
        }, f.prototype.writeUInt32LE = function(e, t, r) {
            return e = +e, t |= 0, r || j(this, e, t, 4, 4294967295, 0), f.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, 
            this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : D(this, e, t, !0), 
            t + 4;
        }, f.prototype.writeUInt32BE = function(e, t, r) {
            return e = +e, t |= 0, r || j(this, e, t, 4, 4294967295, 0), f.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, 
            this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : D(this, e, t, !1), 
            t + 4;
        }, f.prototype.writeIntLE = function(e, t, r, n) {
            if (e = +e, t |= 0, !n) {
                var i = Math.pow(2, 8 * r - 1);
                j(this, e, t, r, i - 1, -i);
            }
            var o = 0, a = 1, s = 0;
            for (this[t] = 255 & e; ++o < r && (a *= 256); ) e < 0 && 0 === s && 0 !== this[t + o - 1] && (s = 1), 
            this[t + o] = (e / a >> 0) - s & 255;
            return t + r;
        }, f.prototype.writeIntBE = function(e, t, r, n) {
            if (e = +e, t |= 0, !n) {
                var i = Math.pow(2, 8 * r - 1);
                j(this, e, t, r, i - 1, -i);
            }
            var o = r - 1, a = 1, s = 0;
            for (this[t + o] = 255 & e; --o >= 0 && (a *= 256); ) e < 0 && 0 === s && 0 !== this[t + o + 1] && (s = 1), 
            this[t + o] = (e / a >> 0) - s & 255;
            return t + r;
        }, f.prototype.writeInt8 = function(e, t, r) {
            return e = +e, t |= 0, r || j(this, e, t, 1, 127, -128), f.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), 
            e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1;
        }, f.prototype.writeInt16LE = function(e, t, r) {
            return e = +e, t |= 0, r || j(this, e, t, 2, 32767, -32768), f.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, 
            this[t + 1] = e >>> 8) : R(this, e, t, !0), t + 2;
        }, f.prototype.writeInt16BE = function(e, t, r) {
            return e = +e, t |= 0, r || j(this, e, t, 2, 32767, -32768), f.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, 
            this[t + 1] = 255 & e) : R(this, e, t, !1), t + 2;
        }, f.prototype.writeInt32LE = function(e, t, r) {
            return e = +e, t |= 0, r || j(this, e, t, 4, 2147483647, -2147483648), f.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, 
            this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : D(this, e, t, !0), 
            t + 4;
        }, f.prototype.writeInt32BE = function(e, t, r) {
            return e = +e, t |= 0, r || j(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), 
            f.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, 
            this[t + 3] = 255 & e) : D(this, e, t, !1), t + 4;
        }, f.prototype.writeFloatLE = function(e, t, r) {
            return q(this, e, t, !0, r);
        }, f.prototype.writeFloatBE = function(e, t, r) {
            return q(this, e, t, !1, r);
        }, f.prototype.writeDoubleLE = function(e, t, r) {
            return N(this, e, t, !0, r);
        }, f.prototype.writeDoubleBE = function(e, t, r) {
            return N(this, e, t, !1, r);
        }, f.prototype.copy = function(e, t, r, n) {
            if (r || (r = 0), n || 0 === n || (n = this.length), t >= e.length && (t = e.length), 
            t || (t = 0), n > 0 && n < r && (n = r), n === r) return 0;
            if (0 === e.length || 0 === this.length) return 0;
            if (t < 0) throw new RangeError("targetStart out of bounds");
            if (r < 0 || r >= this.length) throw new RangeError("sourceStart out of bounds");
            if (n < 0) throw new RangeError("sourceEnd out of bounds");
            n > this.length && (n = this.length), e.length - t < n - r && (n = e.length - t + r);
            var i, o = n - r;
            if (this === e && r < t && t < n) for (i = o - 1; i >= 0; --i) e[i + t] = this[i + r]; else if (o < 1e3 || !f.TYPED_ARRAY_SUPPORT) for (i = 0; i < o; ++i) e[i + t] = this[i + r]; else Uint8Array.prototype.set.call(e, this.subarray(r, r + o), t);
            return o;
        }, f.prototype.fill = function(e, t, r, n) {
            if ("string" == typeof e) {
                if ("string" == typeof t ? (n = t, t = 0, r = this.length) : "string" == typeof r && (n = r, 
                r = this.length), 1 === e.length) {
                    var i = e.charCodeAt(0);
                    i < 256 && (e = i);
                }
                if (void 0 !== n && "string" != typeof n) throw new TypeError("encoding must be a string");
                if ("string" == typeof n && !f.isEncoding(n)) throw new TypeError("Unknown encoding: " + n);
            } else "number" == typeof e && (e &= 255);
            if (t < 0 || this.length < t || this.length < r) throw new RangeError("Out of range index");
            if (r <= t) return this;
            var o;
            if (t >>>= 0, r = void 0 === r ? this.length : r >>> 0, e || (e = 0), "number" == typeof e) for (o = t; o < r; ++o) this[o] = e; else {
                var a = f.isBuffer(e) ? e : U(new f(e, n).toString()), s = a.length;
                for (o = 0; o < r - t; ++o) this[o + t] = a[o % s];
            }
            return this;
        };
        var O = /[^+\/0-9A-Za-z-_]/g;
        function L(e) {
            return e < 16 ? "0" + e.toString(16) : e.toString(16);
        }
        function U(e, t) {
            var r;
            t = t || 1 / 0;
            for (var n = e.length, i = null, o = [], a = 0; a < n; ++a) {
                if ((r = e.charCodeAt(a)) > 55295 && r < 57344) {
                    if (!i) {
                        if (r > 56319) {
                            (t -= 3) > -1 && o.push(239, 191, 189);
                            continue;
                        }
                        if (a + 1 === n) {
                            (t -= 3) > -1 && o.push(239, 191, 189);
                            continue;
                        }
                        i = r;
                        continue;
                    }
                    if (r < 56320) {
                        (t -= 3) > -1 && o.push(239, 191, 189), i = r;
                        continue;
                    }
                    r = 65536 + (i - 55296 << 10 | r - 56320);
                } else i && (t -= 3) > -1 && o.push(239, 191, 189);
                if (i = null, r < 128) {
                    if ((t -= 1) < 0) break;
                    o.push(r);
                } else if (r < 2048) {
                    if ((t -= 2) < 0) break;
                    o.push(r >> 6 | 192, 63 & r | 128);
                } else if (r < 65536) {
                    if ((t -= 3) < 0) break;
                    o.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128);
                } else {
                    if (!(r < 1114112)) throw new Error("Invalid code point");
                    if ((t -= 4) < 0) break;
                    o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128);
                }
            }
            return o;
        }
        function z(e) {
            return n.toByteArray(function(e) {
                if ((e = function(e) {
                    return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
                }(e).replace(O, "")).length < 2) return "";
                for (;e.length % 4 != 0; ) e += "=";
                return e;
            }(e));
        }
        function H(e, t, r, n) {
            for (var i = 0; i < n && !(i + r >= t.length || i >= e.length); ++i) t[i + r] = e[i];
            return i;
        }
    }).call(this, r(3));
}, function(e, t, r) {
    "use strict";
    t.byteLength = function(e) {
        var t = c(e), r = t[0], n = t[1];
        return 3 * (r + n) / 4 - n;
    }, t.toByteArray = function(e) {
        var t, r, n = c(e), a = n[0], s = n[1], f = new o(function(e, t, r) {
            return 3 * (t + r) / 4 - r;
        }(0, a, s)), u = 0, d = s > 0 ? a - 4 : a;
        for (r = 0; r < d; r += 4) t = i[e.charCodeAt(r)] << 18 | i[e.charCodeAt(r + 1)] << 12 | i[e.charCodeAt(r + 2)] << 6 | i[e.charCodeAt(r + 3)], 
        f[u++] = t >> 16 & 255, f[u++] = t >> 8 & 255, f[u++] = 255 & t;
        2 === s && (t = i[e.charCodeAt(r)] << 2 | i[e.charCodeAt(r + 1)] >> 4, f[u++] = 255 & t);
        1 === s && (t = i[e.charCodeAt(r)] << 10 | i[e.charCodeAt(r + 1)] << 4 | i[e.charCodeAt(r + 2)] >> 2, 
        f[u++] = t >> 8 & 255, f[u++] = 255 & t);
        return f;
    }, t.fromByteArray = function(e) {
        for (var t, r = e.length, i = r % 3, o = [], a = 0, s = r - i; a < s; a += 16383) o.push(u(e, a, a + 16383 > s ? s : a + 16383));
        1 === i ? (t = e[r - 1], o.push(n[t >> 2] + n[t << 4 & 63] + "==")) : 2 === i && (t = (e[r - 2] << 8) + e[r - 1], 
        o.push(n[t >> 10] + n[t >> 4 & 63] + n[t << 2 & 63] + "="));
        return o.join("");
    };
    for (var n = [], i = [], o = "undefined" != typeof Uint8Array ? Uint8Array : Array, a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = 0, f = a.length; s < f; ++s) n[s] = a[s], 
    i[a.charCodeAt(s)] = s;
    function c(e) {
        var t = e.length;
        if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
        var r = e.indexOf("=");
        return -1 === r && (r = t), [ r, r === t ? 0 : 4 - r % 4 ];
    }
    function u(e, t, r) {
        for (var i, o, a = [], s = t; s < r; s += 3) i = (e[s] << 16 & 16711680) + (e[s + 1] << 8 & 65280) + (255 & e[s + 2]), 
        a.push(n[(o = i) >> 18 & 63] + n[o >> 12 & 63] + n[o >> 6 & 63] + n[63 & o]);
        return a.join("");
    }
    i["-".charCodeAt(0)] = 62, i["_".charCodeAt(0)] = 63;
}, function(e, t) {
    t.read = function(e, t, r, n, i) {
        var o, a, s = 8 * i - n - 1, f = (1 << s) - 1, c = f >> 1, u = -7, d = r ? i - 1 : 0, h = r ? -1 : 1, l = e[t + d];
        for (d += h, o = l & (1 << -u) - 1, l >>= -u, u += s; u > 0; o = 256 * o + e[t + d], 
        d += h, u -= 8) ;
        for (a = o & (1 << -u) - 1, o >>= -u, u += n; u > 0; a = 256 * a + e[t + d], d += h, 
        u -= 8) ;
        if (0 === o) o = 1 - c; else {
            if (o === f) return a ? NaN : 1 / 0 * (l ? -1 : 1);
            a += Math.pow(2, n), o -= c;
        }
        return (l ? -1 : 1) * a * Math.pow(2, o - n);
    }, t.write = function(e, t, r, n, i, o) {
        var a, s, f, c = 8 * o - i - 1, u = (1 << c) - 1, d = u >> 1, h = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0, l = n ? 0 : o - 1, p = n ? 1 : -1, b = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
        for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (s = isNaN(t) ? 1 : 0, a = u) : (a = Math.floor(Math.log(t) / Math.LN2), 
        t * (f = Math.pow(2, -a)) < 1 && (a--, f *= 2), (t += a + d >= 1 ? h / f : h * Math.pow(2, 1 - d)) * f >= 2 && (a++, 
        f /= 2), a + d >= u ? (s = 0, a = u) : a + d >= 1 ? (s = (t * f - 1) * Math.pow(2, i), 
        a += d) : (s = t * Math.pow(2, d - 1) * Math.pow(2, i), a = 0)); i >= 8; e[r + l] = 255 & s, 
        l += p, s /= 256, i -= 8) ;
        for (a = a << i | s, c += i; c > 0; e[r + l] = 255 & a, l += p, a /= 256, c -= 8) ;
        e[r + l - p] |= 128 * b;
    };
}, function(e, t) {
    var r = {}.toString;
    e.exports = Array.isArray || function(e) {
        return "[object Array]" == r.call(e);
    };
}, function(e, t, r) {
    "use strict";
    var n = r(17), i = r(18), o = r(44), a = r(45), s = r(53);
    function f(e) {
        s.call(this, "digest"), this._hash = e;
    }
    n(f, s), f.prototype._update = function(e) {
        this._hash.update(e);
    }, f.prototype._final = function() {
        return this._hash.digest();
    }, e.exports = function(e) {
        return "md5" === (e = e.toLowerCase()) ? new i : "rmd160" === e || "ripemd160" === e ? new o : new f(a(e));
    };
}, function(e, t) {
    "function" == typeof Object.create ? e.exports = function(e, t) {
        t && (e.super_ = t, e.prototype = Object.create(t.prototype, {
            constructor: {
                value: e,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }));
    } : e.exports = function(e, t) {
        if (t) {
            e.super_ = t;
            var r = function() {};
            r.prototype = t.prototype, e.prototype = new r, e.prototype.constructor = e;
        }
    };
}, function(e, t, r) {
    "use strict";
    var n = r(17), i = r(19), o = r(11).Buffer, a = new Array(16);
    function s() {
        i.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, 
        this._d = 271733878;
    }
    function f(e, t) {
        return e << t | e >>> 32 - t;
    }
    function c(e, t, r, n, i, o, a) {
        return f(e + (t & r | ~t & n) + i + o | 0, a) + t | 0;
    }
    function u(e, t, r, n, i, o, a) {
        return f(e + (t & n | r & ~n) + i + o | 0, a) + t | 0;
    }
    function d(e, t, r, n, i, o, a) {
        return f(e + (t ^ r ^ n) + i + o | 0, a) + t | 0;
    }
    function h(e, t, r, n, i, o, a) {
        return f(e + (r ^ (t | ~n)) + i + o | 0, a) + t | 0;
    }
    n(s, i), s.prototype._update = function() {
        for (var e = a, t = 0; t < 16; ++t) e[t] = this._block.readInt32LE(4 * t);
        var r = this._a, n = this._b, i = this._c, o = this._d;
        r = c(r, n, i, o, e[0], 3614090360, 7), o = c(o, r, n, i, e[1], 3905402710, 12), 
        i = c(i, o, r, n, e[2], 606105819, 17), n = c(n, i, o, r, e[3], 3250441966, 22), 
        r = c(r, n, i, o, e[4], 4118548399, 7), o = c(o, r, n, i, e[5], 1200080426, 12), 
        i = c(i, o, r, n, e[6], 2821735955, 17), n = c(n, i, o, r, e[7], 4249261313, 22), 
        r = c(r, n, i, o, e[8], 1770035416, 7), o = c(o, r, n, i, e[9], 2336552879, 12), 
        i = c(i, o, r, n, e[10], 4294925233, 17), n = c(n, i, o, r, e[11], 2304563134, 22), 
        r = c(r, n, i, o, e[12], 1804603682, 7), o = c(o, r, n, i, e[13], 4254626195, 12), 
        i = c(i, o, r, n, e[14], 2792965006, 17), r = u(r, n = c(n, i, o, r, e[15], 1236535329, 22), i, o, e[1], 4129170786, 5), 
        o = u(o, r, n, i, e[6], 3225465664, 9), i = u(i, o, r, n, e[11], 643717713, 14), 
        n = u(n, i, o, r, e[0], 3921069994, 20), r = u(r, n, i, o, e[5], 3593408605, 5), 
        o = u(o, r, n, i, e[10], 38016083, 9), i = u(i, o, r, n, e[15], 3634488961, 14), 
        n = u(n, i, o, r, e[4], 3889429448, 20), r = u(r, n, i, o, e[9], 568446438, 5), 
        o = u(o, r, n, i, e[14], 3275163606, 9), i = u(i, o, r, n, e[3], 4107603335, 14), 
        n = u(n, i, o, r, e[8], 1163531501, 20), r = u(r, n, i, o, e[13], 2850285829, 5), 
        o = u(o, r, n, i, e[2], 4243563512, 9), i = u(i, o, r, n, e[7], 1735328473, 14), 
        r = d(r, n = u(n, i, o, r, e[12], 2368359562, 20), i, o, e[5], 4294588738, 4), o = d(o, r, n, i, e[8], 2272392833, 11), 
        i = d(i, o, r, n, e[11], 1839030562, 16), n = d(n, i, o, r, e[14], 4259657740, 23), 
        r = d(r, n, i, o, e[1], 2763975236, 4), o = d(o, r, n, i, e[4], 1272893353, 11), 
        i = d(i, o, r, n, e[7], 4139469664, 16), n = d(n, i, o, r, e[10], 3200236656, 23), 
        r = d(r, n, i, o, e[13], 681279174, 4), o = d(o, r, n, i, e[0], 3936430074, 11), 
        i = d(i, o, r, n, e[3], 3572445317, 16), n = d(n, i, o, r, e[6], 76029189, 23), 
        r = d(r, n, i, o, e[9], 3654602809, 4), o = d(o, r, n, i, e[12], 3873151461, 11), 
        i = d(i, o, r, n, e[15], 530742520, 16), r = h(r, n = d(n, i, o, r, e[2], 3299628645, 23), i, o, e[0], 4096336452, 6), 
        o = h(o, r, n, i, e[7], 1126891415, 10), i = h(i, o, r, n, e[14], 2878612391, 15), 
        n = h(n, i, o, r, e[5], 4237533241, 21), r = h(r, n, i, o, e[12], 1700485571, 6), 
        o = h(o, r, n, i, e[3], 2399980690, 10), i = h(i, o, r, n, e[10], 4293915773, 15), 
        n = h(n, i, o, r, e[1], 2240044497, 21), r = h(r, n, i, o, e[8], 1873313359, 6), 
        o = h(o, r, n, i, e[15], 4264355552, 10), i = h(i, o, r, n, e[6], 2734768916, 15), 
        n = h(n, i, o, r, e[13], 1309151649, 21), r = h(r, n, i, o, e[4], 4149444226, 6), 
        o = h(o, r, n, i, e[11], 3174756917, 10), i = h(i, o, r, n, e[2], 718787259, 15), 
        n = h(n, i, o, r, e[9], 3951481745, 21), this._a = this._a + r | 0, this._b = this._b + n | 0, 
        this._c = this._c + i | 0, this._d = this._d + o | 0;
    }, s.prototype._digest = function() {
        this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), 
        this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), 
        this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), 
        this._update();
        var e = o.allocUnsafe(16);
        return e.writeInt32LE(this._a, 0), e.writeInt32LE(this._b, 4), e.writeInt32LE(this._c, 8), 
        e.writeInt32LE(this._d, 12), e;
    }, e.exports = s;
}, function(e, t, r) {
    "use strict";
    var n = r(11).Buffer, i = r(20).Transform;
    function o(e) {
        i.call(this), this._block = n.allocUnsafe(e), this._blockSize = e, this._blockOffset = 0, 
        this._length = [ 0, 0, 0, 0 ], this._finalized = !1;
    }
    r(17)(o, i), o.prototype._transform = function(e, t, r) {
        var n = null;
        try {
            this.update(e, t);
        } catch (e) {
            n = e;
        }
        r(n);
    }, o.prototype._flush = function(e) {
        var t = null;
        try {
            this.push(this.digest());
        } catch (e) {
            t = e;
        }
        e(t);
    }, o.prototype.update = function(e, t) {
        if (function(e, t) {
            if (!n.isBuffer(e) && "string" != typeof e) throw new TypeError(t + " must be a string or a buffer");
        }(e, "Data"), this._finalized) throw new Error("Digest already called");
        n.isBuffer(e) || (e = n.from(e, t));
        for (var r = this._block, i = 0; this._blockOffset + e.length - i >= this._blockSize; ) {
            for (var o = this._blockOffset; o < this._blockSize; ) r[o++] = e[i++];
            this._update(), this._blockOffset = 0;
        }
        for (;i < e.length; ) r[this._blockOffset++] = e[i++];
        for (var a = 0, s = 8 * e.length; s > 0; ++a) this._length[a] += s, (s = this._length[a] / 4294967296 | 0) > 0 && (this._length[a] -= 4294967296 * s);
        return this;
    }, o.prototype._update = function() {
        throw new Error("_update is not implemented");
    }, o.prototype.digest = function(e) {
        if (this._finalized) throw new Error("Digest already called");
        this._finalized = !0;
        var t = this._digest();
        void 0 !== e && (t = t.toString(e)), this._block.fill(0), this._blockOffset = 0;
        for (var r = 0; r < 4; ++r) this._length[r] = 0;
        return t;
    }, o.prototype._digest = function() {
        throw new Error("_digest is not implemented");
    }, e.exports = o;
}, function(e, t, r) {
    e.exports = i;
    var n = r(21).EventEmitter;
    function i() {
        n.call(this);
    }
    r(17)(i, n), i.Readable = r(22), i.Writable = r(40), i.Duplex = r(41), i.Transform = r(42), 
    i.PassThrough = r(43), i.Stream = i, i.prototype.pipe = function(e, t) {
        var r = this;
        function i(t) {
            e.writable && !1 === e.write(t) && r.pause && r.pause();
        }
        function o() {
            r.readable && r.resume && r.resume();
        }
        r.on("data", i), e.on("drain", o), e._isStdio || t && !1 === t.end || (r.on("end", s), 
        r.on("close", f));
        var a = !1;
        function s() {
            a || (a = !0, e.end());
        }
        function f() {
            a || (a = !0, "function" == typeof e.destroy && e.destroy());
        }
        function c(e) {
            if (u(), 0 === n.listenerCount(this, "error")) throw e;
        }
        function u() {
            r.removeListener("data", i), e.removeListener("drain", o), r.removeListener("end", s), 
            r.removeListener("close", f), r.removeListener("error", c), e.removeListener("error", c), 
            r.removeListener("end", u), r.removeListener("close", u), e.removeListener("close", u);
        }
        return r.on("error", c), e.on("error", c), r.on("end", u), r.on("close", u), e.on("close", u), 
        e.emit("pipe", r), e;
    };
}, function(e, t, r) {
    "use strict";
    var n, i = "object" == typeof Reflect ? Reflect : null, o = i && "function" == typeof i.apply ? i.apply : function(e, t, r) {
        return Function.prototype.apply.call(e, t, r);
    };
    n = i && "function" == typeof i.ownKeys ? i.ownKeys : Object.getOwnPropertySymbols ? function(e) {
        return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
    } : function(e) {
        return Object.getOwnPropertyNames(e);
    };
    var a = Number.isNaN || function(e) {
        return e != e;
    };
    function s() {
        s.init.call(this);
    }
    e.exports = s, s.EventEmitter = s, s.prototype._events = void 0, s.prototype._eventsCount = 0, 
    s.prototype._maxListeners = void 0;
    var f = 10;
    function c(e) {
        if ("function" != typeof e) throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof e);
    }
    function u(e) {
        return void 0 === e._maxListeners ? s.defaultMaxListeners : e._maxListeners;
    }
    function d(e, t, r, n) {
        var i, o, a, s;
        if (c(r), void 0 === (o = e._events) ? (o = e._events = Object.create(null), e._eventsCount = 0) : (void 0 !== o.newListener && (e.emit("newListener", t, r.listener ? r.listener : r), 
        o = e._events), a = o[t]), void 0 === a) a = o[t] = r, ++e._eventsCount; else if ("function" == typeof a ? a = o[t] = n ? [ r, a ] : [ a, r ] : n ? a.unshift(r) : a.push(r), 
        (i = u(e)) > 0 && a.length > i && !a.warned) {
            a.warned = !0;
            var f = new Error("Possible EventEmitter memory leak detected. " + a.length + " " + String(t) + " listeners added. Use emitter.setMaxListeners() to increase limit");
            f.name = "MaxListenersExceededWarning", f.emitter = e, f.type = t, f.count = a.length, 
            s = f, console && console.warn && console.warn(s);
        }
        return e;
    }
    function h() {
        if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, 
        0 === arguments.length ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
    }
    function l(e, t, r) {
        var n = {
            fired: !1,
            wrapFn: void 0,
            target: e,
            type: t,
            listener: r
        }, i = h.bind(n);
        return i.listener = r, n.wrapFn = i, i;
    }
    function p(e, t, r) {
        var n = e._events;
        if (void 0 === n) return [];
        var i = n[t];
        return void 0 === i ? [] : "function" == typeof i ? r ? [ i.listener || i ] : [ i ] : r ? function(e) {
            for (var t = new Array(e.length), r = 0; r < t.length; ++r) t[r] = e[r].listener || e[r];
            return t;
        }(i) : m(i, i.length);
    }
    function b(e) {
        var t = this._events;
        if (void 0 !== t) {
            var r = t[e];
            if ("function" == typeof r) return 1;
            if (void 0 !== r) return r.length;
        }
        return 0;
    }
    function m(e, t) {
        for (var r = new Array(t), n = 0; n < t; ++n) r[n] = e[n];
        return r;
    }
    Object.defineProperty(s, "defaultMaxListeners", {
        enumerable: !0,
        get: function() {
            return f;
        },
        set: function(e) {
            if ("number" != typeof e || e < 0 || a(e)) throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + e + ".");
            f = e;
        }
    }), s.init = function() {
        void 0 !== this._events && this._events !== Object.getPrototypeOf(this)._events || (this._events = Object.create(null), 
        this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
    }, s.prototype.setMaxListeners = function(e) {
        if ("number" != typeof e || e < 0 || a(e)) throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
        return this._maxListeners = e, this;
    }, s.prototype.getMaxListeners = function() {
        return u(this);
    }, s.prototype.emit = function(e) {
        for (var t = [], r = 1; r < arguments.length; r++) t.push(arguments[r]);
        var n = "error" === e, i = this._events;
        if (void 0 !== i) n = n && void 0 === i.error; else if (!n) return !1;
        if (n) {
            var a;
            if (t.length > 0 && (a = t[0]), a instanceof Error) throw a;
            var s = new Error("Unhandled error." + (a ? " (" + a.message + ")" : ""));
            throw s.context = a, s;
        }
        var f = i[e];
        if (void 0 === f) return !1;
        if ("function" == typeof f) o(f, this, t); else {
            var c = f.length, u = m(f, c);
            for (r = 0; r < c; ++r) o(u[r], this, t);
        }
        return !0;
    }, s.prototype.addListener = function(e, t) {
        return d(this, e, t, !1);
    }, s.prototype.on = s.prototype.addListener, s.prototype.prependListener = function(e, t) {
        return d(this, e, t, !0);
    }, s.prototype.once = function(e, t) {
        return c(t), this.on(e, l(this, e, t)), this;
    }, s.prototype.prependOnceListener = function(e, t) {
        return c(t), this.prependListener(e, l(this, e, t)), this;
    }, s.prototype.removeListener = function(e, t) {
        var r, n, i, o, a;
        if (c(t), void 0 === (n = this._events)) return this;
        if (void 0 === (r = n[e])) return this;
        if (r === t || r.listener === t) 0 == --this._eventsCount ? this._events = Object.create(null) : (delete n[e], 
        n.removeListener && this.emit("removeListener", e, r.listener || t)); else if ("function" != typeof r) {
            for (i = -1, o = r.length - 1; o >= 0; o--) if (r[o] === t || r[o].listener === t) {
                a = r[o].listener, i = o;
                break;
            }
            if (i < 0) return this;
            0 === i ? r.shift() : function(e, t) {
                for (;t + 1 < e.length; t++) e[t] = e[t + 1];
                e.pop();
            }(r, i), 1 === r.length && (n[e] = r[0]), void 0 !== n.removeListener && this.emit("removeListener", e, a || t);
        }
        return this;
    }, s.prototype.off = s.prototype.removeListener, s.prototype.removeAllListeners = function(e) {
        var t, r, n;
        if (void 0 === (r = this._events)) return this;
        if (void 0 === r.removeListener) return 0 === arguments.length ? (this._events = Object.create(null), 
        this._eventsCount = 0) : void 0 !== r[e] && (0 == --this._eventsCount ? this._events = Object.create(null) : delete r[e]), 
        this;
        if (0 === arguments.length) {
            var i, o = Object.keys(r);
            for (n = 0; n < o.length; ++n) "removeListener" !== (i = o[n]) && this.removeAllListeners(i);
            return this.removeAllListeners("removeListener"), this._events = Object.create(null), 
            this._eventsCount = 0, this;
        }
        if ("function" == typeof (t = r[e])) this.removeListener(e, t); else if (void 0 !== t) for (n = t.length - 1; n >= 0; n--) this.removeListener(e, t[n]);
        return this;
    }, s.prototype.listeners = function(e) {
        return p(this, e, !0);
    }, s.prototype.rawListeners = function(e) {
        return p(this, e, !1);
    }, s.listenerCount = function(e, t) {
        return "function" == typeof e.listenerCount ? e.listenerCount(t) : b.call(e, t);
    }, s.prototype.listenerCount = b, s.prototype.eventNames = function() {
        return this._eventsCount > 0 ? n(this._events) : [];
    };
}, function(e, t, r) {
    (t = e.exports = r(23)).Stream = t, t.Readable = t, t.Writable = r(33), t.Duplex = r(32), 
    t.Transform = r(38), t.PassThrough = r(39);
}, function(e, t, r) {
    "use strict";
    (function(t, n) {
        var i = r(24);
        e.exports = v;
        var o, a = r(15);
        v.ReadableState = y;
        r(21).EventEmitter;
        var s = function(e, t) {
            return e.listeners(t).length;
        }, f = r(25), c = r(26).Buffer, u = t.Uint8Array || function() {};
        var d = Object.create(r(27));
        d.inherits = r(17);
        var h = r(28), l = void 0;
        l = h && h.debuglog ? h.debuglog("stream") : function() {};
        var p, b = r(29), m = r(31);
        d.inherits(v, f);
        var g = [ "error", "close", "destroy", "pause", "resume" ];
        function y(e, t) {
            e = e || {};
            var n = t instanceof (o = o || r(32));
            this.objectMode = !!e.objectMode, n && (this.objectMode = this.objectMode || !!e.readableObjectMode);
            var i = e.highWaterMark, a = e.readableHighWaterMark, s = this.objectMode ? 16 : 16384;
            this.highWaterMark = i || 0 === i ? i : n && (a || 0 === a) ? a : s, this.highWaterMark = Math.floor(this.highWaterMark), 
            this.buffer = new b, this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, 
            this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, 
            this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, 
            this.destroyed = !1, this.defaultEncoding = e.defaultEncoding || "utf8", this.awaitDrain = 0, 
            this.readingMore = !1, this.decoder = null, this.encoding = null, e.encoding && (p || (p = r(37).StringDecoder), 
            this.decoder = new p(e.encoding), this.encoding = e.encoding);
        }
        function v(e) {
            if (o = o || r(32), !(this instanceof v)) return new v(e);
            this._readableState = new y(e, this), this.readable = !0, e && ("function" == typeof e.read && (this._read = e.read), 
            "function" == typeof e.destroy && (this._destroy = e.destroy)), f.call(this);
        }
        function w(e, t, r, n, i) {
            var o, a = e._readableState;
            null === t ? (a.reading = !1, function(e, t) {
                if (t.ended) return;
                if (t.decoder) {
                    var r = t.decoder.end();
                    r && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length);
                }
                t.ended = !0, S(e);
            }(e, a)) : (i || (o = function(e, t) {
                var r;
                n = t, c.isBuffer(n) || n instanceof u || "string" == typeof t || void 0 === t || e.objectMode || (r = new TypeError("Invalid non-string/buffer chunk"));
                var n;
                return r;
            }(a, t)), o ? e.emit("error", o) : a.objectMode || t && t.length > 0 ? ("string" == typeof t || a.objectMode || Object.getPrototypeOf(t) === c.prototype || (t = function(e) {
                return c.from(e);
            }(t)), n ? a.endEmitted ? e.emit("error", new Error("stream.unshift() after end event")) : _(e, a, t, !0) : a.ended ? e.emit("error", new Error("stream.push() after EOF")) : (a.reading = !1, 
            a.decoder && !r ? (t = a.decoder.write(t), a.objectMode || 0 !== t.length ? _(e, a, t, !1) : E(e, a)) : _(e, a, t, !1))) : n || (a.reading = !1));
            return function(e) {
                return !e.ended && (e.needReadable || e.length < e.highWaterMark || 0 === e.length);
            }(a);
        }
        function _(e, t, r, n) {
            t.flowing && 0 === t.length && !t.sync ? (e.emit("data", r), e.read(0)) : (t.length += t.objectMode ? 1 : r.length, 
            n ? t.buffer.unshift(r) : t.buffer.push(r), t.needReadable && S(e)), E(e, t);
        }
        Object.defineProperty(v.prototype, "destroyed", {
            get: function() {
                return void 0 !== this._readableState && this._readableState.destroyed;
            },
            set: function(e) {
                this._readableState && (this._readableState.destroyed = e);
            }
        }), v.prototype.destroy = m.destroy, v.prototype._undestroy = m.undestroy, v.prototype._destroy = function(e, t) {
            this.push(null), t(e);
        }, v.prototype.push = function(e, t) {
            var r, n = this._readableState;
            return n.objectMode ? r = !0 : "string" == typeof e && ((t = t || n.defaultEncoding) !== n.encoding && (e = c.from(e, t), 
            t = ""), r = !0), w(this, e, t, !1, r);
        }, v.prototype.unshift = function(e) {
            return w(this, e, null, !0, !1);
        }, v.prototype.isPaused = function() {
            return !1 === this._readableState.flowing;
        }, v.prototype.setEncoding = function(e) {
            return p || (p = r(37).StringDecoder), this._readableState.decoder = new p(e), this._readableState.encoding = e, 
            this;
        };
        function x(e, t) {
            return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e != e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = function(e) {
                return e >= 8388608 ? e = 8388608 : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, 
                e |= e >>> 8, e |= e >>> 16, e++), e;
            }(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
        }
        function S(e) {
            var t = e._readableState;
            t.needReadable = !1, t.emittedReadable || (l("emitReadable", t.flowing), t.emittedReadable = !0, 
            t.sync ? i.nextTick(A, e) : A(e));
        }
        function A(e) {
            l("emit readable"), e.emit("readable"), T(e);
        }
        function E(e, t) {
            t.readingMore || (t.readingMore = !0, i.nextTick(M, e, t));
        }
        function M(e, t) {
            for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (l("maybeReadMore read 0"), 
            e.read(0), r !== t.length); ) r = t.length;
            t.readingMore = !1;
        }
        function k(e) {
            l("readable nexttick read 0"), e.read(0);
        }
        function C(e, t) {
            t.reading || (l("resume read 0"), e.read(0)), t.resumeScheduled = !1, t.awaitDrain = 0, 
            e.emit("resume"), T(e), t.flowing && !t.reading && e.read(0);
        }
        function T(e) {
            var t = e._readableState;
            for (l("flow", t.flowing); t.flowing && null !== e.read(); ) ;
        }
        function I(e, t) {
            return 0 === t.length ? null : (t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (r = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.head.data : t.buffer.concat(t.length), 
            t.buffer.clear()) : r = function(e, t, r) {
                var n;
                e < t.head.data.length ? (n = t.head.data.slice(0, e), t.head.data = t.head.data.slice(e)) : n = e === t.head.data.length ? t.shift() : r ? function(e, t) {
                    var r = t.head, n = 1, i = r.data;
                    e -= i.length;
                    for (;r = r.next; ) {
                        var o = r.data, a = e > o.length ? o.length : e;
                        if (a === o.length ? i += o : i += o.slice(0, e), 0 === (e -= a)) {
                            a === o.length ? (++n, r.next ? t.head = r.next : t.head = t.tail = null) : (t.head = r, 
                            r.data = o.slice(a));
                            break;
                        }
                        ++n;
                    }
                    return t.length -= n, i;
                }(e, t) : function(e, t) {
                    var r = c.allocUnsafe(e), n = t.head, i = 1;
                    n.data.copy(r), e -= n.data.length;
                    for (;n = n.next; ) {
                        var o = n.data, a = e > o.length ? o.length : e;
                        if (o.copy(r, r.length - e, 0, a), 0 === (e -= a)) {
                            a === o.length ? (++i, n.next ? t.head = n.next : t.head = t.tail = null) : (t.head = n, 
                            n.data = o.slice(a));
                            break;
                        }
                        ++i;
                    }
                    return t.length -= i, r;
                }(e, t);
                return n;
            }(e, t.buffer, t.decoder), r);
            var r;
        }
        function B(e) {
            var t = e._readableState;
            if (t.length > 0) throw new Error('"endReadable()" called on non-empty stream');
            t.endEmitted || (t.ended = !0, i.nextTick(j, t, e));
        }
        function j(e, t) {
            e.endEmitted || 0 !== e.length || (e.endEmitted = !0, t.readable = !1, t.emit("end"));
        }
        function R(e, t) {
            for (var r = 0, n = e.length; r < n; r++) if (e[r] === t) return r;
            return -1;
        }
        v.prototype.read = function(e) {
            l("read", e), e = parseInt(e, 10);
            var t = this._readableState, r = e;
            if (0 !== e && (t.emittedReadable = !1), 0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended)) return l("read: emitReadable", t.length, t.ended), 
            0 === t.length && t.ended ? B(this) : S(this), null;
            if (0 === (e = x(e, t)) && t.ended) return 0 === t.length && B(this), null;
            var n, i = t.needReadable;
            return l("need readable", i), (0 === t.length || t.length - e < t.highWaterMark) && l("length less than watermark", i = !0), 
            t.ended || t.reading ? l("reading or ended", i = !1) : i && (l("do read"), t.reading = !0, 
            t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), 
            t.sync = !1, t.reading || (e = x(r, t))), null === (n = e > 0 ? I(e, t) : null) ? (t.needReadable = !0, 
            e = 0) : t.length -= e, 0 === t.length && (t.ended || (t.needReadable = !0), r !== e && t.ended && B(this)), 
            null !== n && this.emit("data", n), n;
        }, v.prototype._read = function(e) {
            this.emit("error", new Error("_read() is not implemented"));
        }, v.prototype.pipe = function(e, t) {
            var r = this, o = this._readableState;
            switch (o.pipesCount) {
              case 0:
                o.pipes = e;
                break;

              case 1:
                o.pipes = [ o.pipes, e ];
                break;

              default:
                o.pipes.push(e);
            }
            o.pipesCount += 1, l("pipe count=%d opts=%j", o.pipesCount, t);
            var f = (!t || !1 !== t.end) && e !== n.stdout && e !== n.stderr ? u : v;
            function c(t, n) {
                l("onunpipe"), t === r && n && !1 === n.hasUnpiped && (n.hasUnpiped = !0, l("cleanup"), 
                e.removeListener("close", g), e.removeListener("finish", y), e.removeListener("drain", d), 
                e.removeListener("error", m), e.removeListener("unpipe", c), r.removeListener("end", u), 
                r.removeListener("end", v), r.removeListener("data", b), h = !0, !o.awaitDrain || e._writableState && !e._writableState.needDrain || d());
            }
            function u() {
                l("onend"), e.end();
            }
            o.endEmitted ? i.nextTick(f) : r.once("end", f), e.on("unpipe", c);
            var d = function(e) {
                return function() {
                    var t = e._readableState;
                    l("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, 0 === t.awaitDrain && s(e, "data") && (t.flowing = !0, 
                    T(e));
                };
            }(r);
            e.on("drain", d);
            var h = !1;
            var p = !1;
            function b(t) {
                l("ondata"), p = !1, !1 !== e.write(t) || p || ((1 === o.pipesCount && o.pipes === e || o.pipesCount > 1 && -1 !== R(o.pipes, e)) && !h && (l("false write response, pause", r._readableState.awaitDrain), 
                r._readableState.awaitDrain++, p = !0), r.pause());
            }
            function m(t) {
                l("onerror", t), v(), e.removeListener("error", m), 0 === s(e, "error") && e.emit("error", t);
            }
            function g() {
                e.removeListener("finish", y), v();
            }
            function y() {
                l("onfinish"), e.removeListener("close", g), v();
            }
            function v() {
                l("unpipe"), r.unpipe(e);
            }
            return r.on("data", b), function(e, t, r) {
                if ("function" == typeof e.prependListener) return e.prependListener(t, r);
                e._events && e._events[t] ? a(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [ r, e._events[t] ] : e.on(t, r);
            }(e, "error", m), e.once("close", g), e.once("finish", y), e.emit("pipe", r), o.flowing || (l("pipe resume"), 
            r.resume()), e;
        }, v.prototype.unpipe = function(e) {
            var t = this._readableState, r = {
                hasUnpiped: !1
            };
            if (0 === t.pipesCount) return this;
            if (1 === t.pipesCount) return e && e !== t.pipes || (e || (e = t.pipes), t.pipes = null, 
            t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this, r)), this;
            if (!e) {
                var n = t.pipes, i = t.pipesCount;
                t.pipes = null, t.pipesCount = 0, t.flowing = !1;
                for (var o = 0; o < i; o++) n[o].emit("unpipe", this, r);
                return this;
            }
            var a = R(t.pipes, e);
            return -1 === a || (t.pipes.splice(a, 1), t.pipesCount -= 1, 1 === t.pipesCount && (t.pipes = t.pipes[0]), 
            e.emit("unpipe", this, r)), this;
        }, v.prototype.on = function(e, t) {
            var r = f.prototype.on.call(this, e, t);
            if ("data" === e) !1 !== this._readableState.flowing && this.resume(); else if ("readable" === e) {
                var n = this._readableState;
                n.endEmitted || n.readableListening || (n.readableListening = n.needReadable = !0, 
                n.emittedReadable = !1, n.reading ? n.length && S(this) : i.nextTick(k, this));
            }
            return r;
        }, v.prototype.addListener = v.prototype.on, v.prototype.resume = function() {
            var e = this._readableState;
            return e.flowing || (l("resume"), e.flowing = !0, function(e, t) {
                t.resumeScheduled || (t.resumeScheduled = !0, i.nextTick(C, e, t));
            }(this, e)), this;
        }, v.prototype.pause = function() {
            return l("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (l("pause"), 
            this._readableState.flowing = !1, this.emit("pause")), this;
        }, v.prototype.wrap = function(e) {
            var t = this, r = this._readableState, n = !1;
            for (var i in e.on("end", (function() {
                if (l("wrapped end"), r.decoder && !r.ended) {
                    var e = r.decoder.end();
                    e && e.length && t.push(e);
                }
                t.push(null);
            })), e.on("data", (function(i) {
                (l("wrapped data"), r.decoder && (i = r.decoder.write(i)), r.objectMode && null == i) || (r.objectMode || i && i.length) && (t.push(i) || (n = !0, 
                e.pause()));
            })), e) void 0 === this[i] && "function" == typeof e[i] && (this[i] = function(t) {
                return function() {
                    return e[t].apply(e, arguments);
                };
            }(i));
            for (var o = 0; o < g.length; o++) e.on(g[o], this.emit.bind(this, g[o]));
            return this._read = function(t) {
                l("wrapped _read", t), n && (n = !1, e.resume());
            }, this;
        }, Object.defineProperty(v.prototype, "readableHighWaterMark", {
            enumerable: !1,
            get: function() {
                return this._readableState.highWaterMark;
            }
        }), v._fromList = I;
    }).call(this, r(3), r(10));
}, function(e, t, r) {
    "use strict";
    (function(t) {
        void 0 === t || !t.version || 0 === t.version.indexOf("v0.") || 0 === t.version.indexOf("v1.") && 0 !== t.version.indexOf("v1.8.") ? e.exports = {
            nextTick: function(e, r, n, i) {
                if ("function" != typeof e) throw new TypeError('"callback" argument must be a function');
                var o, a, s = arguments.length;
                switch (s) {
                  case 0:
                  case 1:
                    return t.nextTick(e);

                  case 2:
                    return t.nextTick((function() {
                        e.call(null, r);
                    }));

                  case 3:
                    return t.nextTick((function() {
                        e.call(null, r, n);
                    }));

                  case 4:
                    return t.nextTick((function() {
                        e.call(null, r, n, i);
                    }));

                  default:
                    for (o = new Array(s - 1), a = 0; a < o.length; ) o[a++] = arguments[a];
                    return t.nextTick((function() {
                        e.apply(null, o);
                    }));
                }
            }
        } : e.exports = t;
    }).call(this, r(10));
}, function(e, t, r) {
    e.exports = r(21).EventEmitter;
}, function(e, t, r) {
    var n = r(12), i = n.Buffer;
    function o(e, t) {
        for (var r in e) t[r] = e[r];
    }
    function a(e, t, r) {
        return i(e, t, r);
    }
    i.from && i.alloc && i.allocUnsafe && i.allocUnsafeSlow ? e.exports = n : (o(n, t), 
    t.Buffer = a), o(i, a), a.from = function(e, t, r) {
        if ("number" == typeof e) throw new TypeError("Argument must not be a number");
        return i(e, t, r);
    }, a.alloc = function(e, t, r) {
        if ("number" != typeof e) throw new TypeError("Argument must be a number");
        var n = i(e);
        return void 0 !== t ? "string" == typeof r ? n.fill(t, r) : n.fill(t) : n.fill(0), 
        n;
    }, a.allocUnsafe = function(e) {
        if ("number" != typeof e) throw new TypeError("Argument must be a number");
        return i(e);
    }, a.allocUnsafeSlow = function(e) {
        if ("number" != typeof e) throw new TypeError("Argument must be a number");
        return n.SlowBuffer(e);
    };
}, function(e, t, r) {
    (function(e) {
        function r(e) {
            return Object.prototype.toString.call(e);
        }
        t.isArray = function(e) {
            return Array.isArray ? Array.isArray(e) : "[object Array]" === r(e);
        }, t.isBoolean = function(e) {
            return "boolean" == typeof e;
        }, t.isNull = function(e) {
            return null === e;
        }, t.isNullOrUndefined = function(e) {
            return null == e;
        }, t.isNumber = function(e) {
            return "number" == typeof e;
        }, t.isString = function(e) {
            return "string" == typeof e;
        }, t.isSymbol = function(e) {
            return "symbol" == typeof e;
        }, t.isUndefined = function(e) {
            return void 0 === e;
        }, t.isRegExp = function(e) {
            return "[object RegExp]" === r(e);
        }, t.isObject = function(e) {
            return "object" == typeof e && null !== e;
        }, t.isDate = function(e) {
            return "[object Date]" === r(e);
        }, t.isError = function(e) {
            return "[object Error]" === r(e) || e instanceof Error;
        }, t.isFunction = function(e) {
            return "function" == typeof e;
        }, t.isPrimitive = function(e) {
            return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || void 0 === e;
        }, t.isBuffer = e.isBuffer;
    }).call(this, r(12).Buffer);
}, function(e, t) {}, function(e, t, r) {
    "use strict";
    var n = r(26).Buffer, i = r(30);
    e.exports = function() {
        function e() {
            !function(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
            }(this, e), this.head = null, this.tail = null, this.length = 0;
        }
        return e.prototype.push = function(e) {
            var t = {
                data: e,
                next: null
            };
            this.length > 0 ? this.tail.next = t : this.head = t, this.tail = t, ++this.length;
        }, e.prototype.unshift = function(e) {
            var t = {
                data: e,
                next: this.head
            };
            0 === this.length && (this.tail = t), this.head = t, ++this.length;
        }, e.prototype.shift = function() {
            if (0 !== this.length) {
                var e = this.head.data;
                return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, 
                --this.length, e;
            }
        }, e.prototype.clear = function() {
            this.head = this.tail = null, this.length = 0;
        }, e.prototype.join = function(e) {
            if (0 === this.length) return "";
            for (var t = this.head, r = "" + t.data; t = t.next; ) r += e + t.data;
            return r;
        }, e.prototype.concat = function(e) {
            if (0 === this.length) return n.alloc(0);
            if (1 === this.length) return this.head.data;
            for (var t, r, i, o = n.allocUnsafe(e >>> 0), a = this.head, s = 0; a; ) t = a.data, 
            r = o, i = s, t.copy(r, i), s += a.data.length, a = a.next;
            return o;
        }, e;
    }(), i && i.inspect && i.inspect.custom && (e.exports.prototype[i.inspect.custom] = function() {
        var e = i.inspect({
            length: this.length
        });
        return this.constructor.name + " " + e;
    });
}, function(e, t) {}, function(e, t, r) {
    "use strict";
    var n = r(24);
    function i(e, t) {
        e.emit("error", t);
    }
    e.exports = {
        destroy: function(e, t) {
            var r = this, o = this._readableState && this._readableState.destroyed, a = this._writableState && this._writableState.destroyed;
            return o || a ? (t ? t(e) : !e || this._writableState && this._writableState.errorEmitted || n.nextTick(i, this, e), 
            this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), 
            this._destroy(e || null, (function(e) {
                !t && e ? (n.nextTick(i, r, e), r._writableState && (r._writableState.errorEmitted = !0)) : t && t(e);
            })), this);
        },
        undestroy: function() {
            this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, 
            this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, 
            this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finished = !1, 
            this._writableState.errorEmitted = !1);
        }
    };
}, function(e, t, r) {
    "use strict";
    var n = r(24), i = Object.keys || function(e) {
        var t = [];
        for (var r in e) t.push(r);
        return t;
    };
    e.exports = d;
    var o = Object.create(r(27));
    o.inherits = r(17);
    var a = r(23), s = r(33);
    o.inherits(d, a);
    for (var f = i(s.prototype), c = 0; c < f.length; c++) {
        var u = f[c];
        d.prototype[u] || (d.prototype[u] = s.prototype[u]);
    }
    function d(e) {
        if (!(this instanceof d)) return new d(e);
        a.call(this, e), s.call(this, e), e && !1 === e.readable && (this.readable = !1), 
        e && !1 === e.writable && (this.writable = !1), this.allowHalfOpen = !0, e && !1 === e.allowHalfOpen && (this.allowHalfOpen = !1), 
        this.once("end", h);
    }
    function h() {
        this.allowHalfOpen || this._writableState.ended || n.nextTick(l, this);
    }
    function l(e) {
        e.end();
    }
    Object.defineProperty(d.prototype, "writableHighWaterMark", {
        enumerable: !1,
        get: function() {
            return this._writableState.highWaterMark;
        }
    }), Object.defineProperty(d.prototype, "destroyed", {
        get: function() {
            return void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed && this._writableState.destroyed);
        },
        set: function(e) {
            void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = e, 
            this._writableState.destroyed = e);
        }
    }), d.prototype._destroy = function(e, t) {
        this.push(null), this.end(), n.nextTick(t, e);
    };
}, function(e, t, r) {
    "use strict";
    (function(t, n, i) {
        var o = r(24);
        function a(e) {
            var t = this;
            this.next = null, this.entry = null, this.finish = function() {
                !function(e, t, r) {
                    var n = e.entry;
                    e.entry = null;
                    for (;n; ) {
                        var i = n.callback;
                        t.pendingcb--, i(r), n = n.next;
                    }
                    t.corkedRequestsFree ? t.corkedRequestsFree.next = e : t.corkedRequestsFree = e;
                }(t, e);
            };
        }
        e.exports = y;
        var s, f = !t.browser && [ "v0.10", "v0.9." ].indexOf(t.version.slice(0, 5)) > -1 ? n : o.nextTick;
        y.WritableState = g;
        var c = Object.create(r(27));
        c.inherits = r(17);
        var u = {
            deprecate: r(36)
        }, d = r(25), h = r(26).Buffer, l = i.Uint8Array || function() {};
        var p, b = r(31);
        function m() {}
        function g(e, t) {
            s = s || r(32), e = e || {};
            var n = t instanceof s;
            this.objectMode = !!e.objectMode, n && (this.objectMode = this.objectMode || !!e.writableObjectMode);
            var i = e.highWaterMark, c = e.writableHighWaterMark, u = this.objectMode ? 16 : 16384;
            this.highWaterMark = i || 0 === i ? i : n && (c || 0 === c) ? c : u, this.highWaterMark = Math.floor(this.highWaterMark), 
            this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, 
            this.destroyed = !1;
            var d = !1 === e.decodeStrings;
            this.decodeStrings = !d, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, 
            this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, 
            this.onwrite = function(e) {
                !function(e, t) {
                    var r = e._writableState, n = r.sync, i = r.writecb;
                    if (function(e) {
                        e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;
                    }(r), t) !function(e, t, r, n, i) {
                        --t.pendingcb, r ? (o.nextTick(i, n), o.nextTick(A, e, t), e._writableState.errorEmitted = !0, 
                        e.emit("error", n)) : (i(n), e._writableState.errorEmitted = !0, e.emit("error", n), 
                        A(e, t));
                    }(e, r, n, t, i); else {
                        var a = x(r);
                        a || r.corked || r.bufferProcessing || !r.bufferedRequest || _(e, r), n ? f(w, e, r, a, i) : w(e, r, a, i);
                    }
                }(t, e);
            }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, 
            this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, 
            this.corkedRequestsFree = new a(this);
        }
        function y(e) {
            if (s = s || r(32), !(p.call(y, this) || this instanceof s)) return new y(e);
            this._writableState = new g(e, this), this.writable = !0, e && ("function" == typeof e.write && (this._write = e.write), 
            "function" == typeof e.writev && (this._writev = e.writev), "function" == typeof e.destroy && (this._destroy = e.destroy), 
            "function" == typeof e.final && (this._final = e.final)), d.call(this);
        }
        function v(e, t, r, n, i, o, a) {
            t.writelen = n, t.writecb = a, t.writing = !0, t.sync = !0, r ? e._writev(i, t.onwrite) : e._write(i, o, t.onwrite), 
            t.sync = !1;
        }
        function w(e, t, r, n) {
            r || function(e, t) {
                0 === t.length && t.needDrain && (t.needDrain = !1, e.emit("drain"));
            }(e, t), t.pendingcb--, n(), A(e, t);
        }
        function _(e, t) {
            t.bufferProcessing = !0;
            var r = t.bufferedRequest;
            if (e._writev && r && r.next) {
                var n = t.bufferedRequestCount, i = new Array(n), o = t.corkedRequestsFree;
                o.entry = r;
                for (var s = 0, f = !0; r; ) i[s] = r, r.isBuf || (f = !1), r = r.next, s += 1;
                i.allBuffers = f, v(e, t, !0, t.length, i, "", o.finish), t.pendingcb++, t.lastBufferedRequest = null, 
                o.next ? (t.corkedRequestsFree = o.next, o.next = null) : t.corkedRequestsFree = new a(t), 
                t.bufferedRequestCount = 0;
            } else {
                for (;r; ) {
                    var c = r.chunk, u = r.encoding, d = r.callback;
                    if (v(e, t, !1, t.objectMode ? 1 : c.length, c, u, d), r = r.next, t.bufferedRequestCount--, 
                    t.writing) break;
                }
                null === r && (t.lastBufferedRequest = null);
            }
            t.bufferedRequest = r, t.bufferProcessing = !1;
        }
        function x(e) {
            return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing;
        }
        function S(e, t) {
            e._final((function(r) {
                t.pendingcb--, r && e.emit("error", r), t.prefinished = !0, e.emit("prefinish"), 
                A(e, t);
            }));
        }
        function A(e, t) {
            var r = x(t);
            return r && (!function(e, t) {
                t.prefinished || t.finalCalled || ("function" == typeof e._final ? (t.pendingcb++, 
                t.finalCalled = !0, o.nextTick(S, e, t)) : (t.prefinished = !0, e.emit("prefinish")));
            }(e, t), 0 === t.pendingcb && (t.finished = !0, e.emit("finish"))), r;
        }
        c.inherits(y, d), g.prototype.getBuffer = function() {
            for (var e = this.bufferedRequest, t = []; e; ) t.push(e), e = e.next;
            return t;
        }, function() {
            try {
                Object.defineProperty(g.prototype, "buffer", {
                    get: u.deprecate((function() {
                        return this.getBuffer();
                    }), "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
                });
            } catch (e) {}
        }(), "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (p = Function.prototype[Symbol.hasInstance], 
        Object.defineProperty(y, Symbol.hasInstance, {
            value: function(e) {
                return !!p.call(this, e) || this === y && (e && e._writableState instanceof g);
            }
        })) : p = function(e) {
            return e instanceof this;
        }, y.prototype.pipe = function() {
            this.emit("error", new Error("Cannot pipe, not readable"));
        }, y.prototype.write = function(e, t, r) {
            var n, i = this._writableState, a = !1, s = !i.objectMode && (n = e, h.isBuffer(n) || n instanceof l);
            return s && !h.isBuffer(e) && (e = function(e) {
                return h.from(e);
            }(e)), "function" == typeof t && (r = t, t = null), s ? t = "buffer" : t || (t = i.defaultEncoding), 
            "function" != typeof r && (r = m), i.ended ? function(e, t) {
                var r = new Error("write after end");
                e.emit("error", r), o.nextTick(t, r);
            }(this, r) : (s || function(e, t, r, n) {
                var i = !0, a = !1;
                return null === r ? a = new TypeError("May not write null values to stream") : "string" == typeof r || void 0 === r || t.objectMode || (a = new TypeError("Invalid non-string/buffer chunk")), 
                a && (e.emit("error", a), o.nextTick(n, a), i = !1), i;
            }(this, i, e, r)) && (i.pendingcb++, a = function(e, t, r, n, i, o) {
                if (!r) {
                    var a = function(e, t, r) {
                        e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = h.from(t, r));
                        return t;
                    }(t, n, i);
                    n !== a && (r = !0, i = "buffer", n = a);
                }
                var s = t.objectMode ? 1 : n.length;
                t.length += s;
                var f = t.length < t.highWaterMark;
                f || (t.needDrain = !0);
                if (t.writing || t.corked) {
                    var c = t.lastBufferedRequest;
                    t.lastBufferedRequest = {
                        chunk: n,
                        encoding: i,
                        isBuf: r,
                        callback: o,
                        next: null
                    }, c ? c.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, 
                    t.bufferedRequestCount += 1;
                } else v(e, t, !1, s, n, i, o);
                return f;
            }(this, i, s, e, t, r)), a;
        }, y.prototype.cork = function() {
            this._writableState.corked++;
        }, y.prototype.uncork = function() {
            var e = this._writableState;
            e.corked && (e.corked--, e.writing || e.corked || e.finished || e.bufferProcessing || !e.bufferedRequest || _(this, e));
        }, y.prototype.setDefaultEncoding = function(e) {
            if ("string" == typeof e && (e = e.toLowerCase()), !([ "hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw" ].indexOf((e + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + e);
            return this._writableState.defaultEncoding = e, this;
        }, Object.defineProperty(y.prototype, "writableHighWaterMark", {
            enumerable: !1,
            get: function() {
                return this._writableState.highWaterMark;
            }
        }), y.prototype._write = function(e, t, r) {
            r(new Error("_write() is not implemented"));
        }, y.prototype._writev = null, y.prototype.end = function(e, t, r) {
            var n = this._writableState;
            "function" == typeof e ? (r = e, e = null, t = null) : "function" == typeof t && (r = t, 
            t = null), null != e && this.write(e, t), n.corked && (n.corked = 1, this.uncork()), 
            n.ending || n.finished || function(e, t, r) {
                t.ending = !0, A(e, t), r && (t.finished ? o.nextTick(r) : e.once("finish", r));
                t.ended = !0, e.writable = !1;
            }(this, n, r);
        }, Object.defineProperty(y.prototype, "destroyed", {
            get: function() {
                return void 0 !== this._writableState && this._writableState.destroyed;
            },
            set: function(e) {
                this._writableState && (this._writableState.destroyed = e);
            }
        }), y.prototype.destroy = b.destroy, y.prototype._undestroy = b.undestroy, y.prototype._destroy = function(e, t) {
            this.end(), t(e);
        };
    }).call(this, r(10), r(34).setImmediate, r(3));
}, function(e, t, r) {
    (function(e) {
        var n = void 0 !== e && e || "undefined" != typeof self && self || window, i = Function.prototype.apply;
        function o(e, t) {
            this._id = e, this._clearFn = t;
        }
        t.setTimeout = function() {
            return new o(i.call(setTimeout, n, arguments), clearTimeout);
        }, t.setInterval = function() {
            return new o(i.call(setInterval, n, arguments), clearInterval);
        }, t.clearTimeout = t.clearInterval = function(e) {
            e && e.close();
        }, o.prototype.unref = o.prototype.ref = function() {}, o.prototype.close = function() {
            this._clearFn.call(n, this._id);
        }, t.enroll = function(e, t) {
            clearTimeout(e._idleTimeoutId), e._idleTimeout = t;
        }, t.unenroll = function(e) {
            clearTimeout(e._idleTimeoutId), e._idleTimeout = -1;
        }, t._unrefActive = t.active = function(e) {
            clearTimeout(e._idleTimeoutId);
            var t = e._idleTimeout;
            t >= 0 && (e._idleTimeoutId = setTimeout((function() {
                e._onTimeout && e._onTimeout();
            }), t));
        }, r(35), t.setImmediate = "undefined" != typeof self && self.setImmediate || void 0 !== e && e.setImmediate || this && this.setImmediate, 
        t.clearImmediate = "undefined" != typeof self && self.clearImmediate || void 0 !== e && e.clearImmediate || this && this.clearImmediate;
    }).call(this, r(3));
}, function(e, t, r) {
    (function(e, t) {
        !function(e, r) {
            "use strict";
            if (!e.setImmediate) {
                var n, i, o, a, s, f = 1, c = {}, u = !1, d = e.document, h = Object.getPrototypeOf && Object.getPrototypeOf(e);
                h = h && h.setTimeout ? h : e, "[object process]" === {}.toString.call(e.process) ? n = function(e) {
                    t.nextTick((function() {
                        p(e);
                    }));
                } : !function() {
                    if (e.postMessage && !e.importScripts) {
                        var t = !0, r = e.onmessage;
                        return e.onmessage = function() {
                            t = !1;
                        }, e.postMessage("", "*"), e.onmessage = r, t;
                    }
                }() ? e.MessageChannel ? ((o = new MessageChannel).port1.onmessage = function(e) {
                    p(e.data);
                }, n = function(e) {
                    o.port2.postMessage(e);
                }) : d && "onreadystatechange" in d.createElement("script") ? (i = d.documentElement, 
                n = function(e) {
                    var t = d.createElement("script");
                    t.onreadystatechange = function() {
                        p(e), t.onreadystatechange = null, i.removeChild(t), t = null;
                    }, i.appendChild(t);
                }) : n = function(e) {
                    setTimeout(p, 0, e);
                } : (a = "setImmediate$" + Math.random() + "$", s = function(t) {
                    t.source === e && "string" == typeof t.data && 0 === t.data.indexOf(a) && p(+t.data.slice(a.length));
                }, e.addEventListener ? e.addEventListener("message", s, !1) : e.attachEvent("onmessage", s), 
                n = function(t) {
                    e.postMessage(a + t, "*");
                }), h.setImmediate = function(e) {
                    "function" != typeof e && (e = new Function("" + e));
                    for (var t = new Array(arguments.length - 1), r = 0; r < t.length; r++) t[r] = arguments[r + 1];
                    var i = {
                        callback: e,
                        args: t
                    };
                    return c[f] = i, n(f), f++;
                }, h.clearImmediate = l;
            }
            function l(e) {
                delete c[e];
            }
            function p(e) {
                if (u) setTimeout(p, 0, e); else {
                    var t = c[e];
                    if (t) {
                        u = !0;
                        try {
                            !function(e) {
                                var t = e.callback, r = e.args;
                                switch (r.length) {
                                  case 0:
                                    t();
                                    break;

                                  case 1:
                                    t(r[0]);
                                    break;

                                  case 2:
                                    t(r[0], r[1]);
                                    break;

                                  case 3:
                                    t(r[0], r[1], r[2]);
                                    break;

                                  default:
                                    t.apply(void 0, r);
                                }
                            }(t);
                        } finally {
                            l(e), u = !1;
                        }
                    }
                }
            }
        }("undefined" == typeof self ? void 0 === e ? this : e : self);
    }).call(this, r(3), r(10));
}, function(e, t, r) {
    (function(t) {
        function r(e) {
            try {
                if (!t.localStorage) return !1;
            } catch (e) {
                return !1;
            }
            var r = t.localStorage[e];
            return null != r && "true" === String(r).toLowerCase();
        }
        e.exports = function(e, t) {
            if (r("noDeprecation")) return e;
            var n = !1;
            return function() {
                if (!n) {
                    if (r("throwDeprecation")) throw new Error(t);
                    r("traceDeprecation") ? console.trace(t) : console.warn(t), n = !0;
                }
                return e.apply(this, arguments);
            };
        };
    }).call(this, r(3));
}, function(e, t, r) {
    "use strict";
    var n = r(11).Buffer, i = n.isEncoding || function(e) {
        switch ((e = "" + e) && e.toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
          case "raw":
            return !0;

          default:
            return !1;
        }
    };
    function o(e) {
        var t;
        switch (this.encoding = function(e) {
            var t = function(e) {
                if (!e) return "utf8";
                for (var t; ;) switch (e) {
                  case "utf8":
                  case "utf-8":
                    return "utf8";

                  case "ucs2":
                  case "ucs-2":
                  case "utf16le":
                  case "utf-16le":
                    return "utf16le";

                  case "latin1":
                  case "binary":
                    return "latin1";

                  case "base64":
                  case "ascii":
                  case "hex":
                    return e;

                  default:
                    if (t) return;
                    e = ("" + e).toLowerCase(), t = !0;
                }
            }(e);
            if ("string" != typeof t && (n.isEncoding === i || !i(e))) throw new Error("Unknown encoding: " + e);
            return t || e;
        }(e), this.encoding) {
          case "utf16le":
            this.text = f, this.end = c, t = 4;
            break;

          case "utf8":
            this.fillLast = s, t = 4;
            break;

          case "base64":
            this.text = u, this.end = d, t = 3;
            break;

          default:
            return this.write = h, void (this.end = l);
        }
        this.lastNeed = 0, this.lastTotal = 0, this.lastChar = n.allocUnsafe(t);
    }
    function a(e) {
        return e <= 127 ? 0 : e >> 5 == 6 ? 2 : e >> 4 == 14 ? 3 : e >> 3 == 30 ? 4 : e >> 6 == 2 ? -1 : -2;
    }
    function s(e) {
        var t = this.lastTotal - this.lastNeed, r = function(e, t, r) {
            if (128 != (192 & t[0])) return e.lastNeed = 0, "�";
            if (e.lastNeed > 1 && t.length > 1) {
                if (128 != (192 & t[1])) return e.lastNeed = 1, "�";
                if (e.lastNeed > 2 && t.length > 2 && 128 != (192 & t[2])) return e.lastNeed = 2, 
                "�";
            }
        }(this, e);
        return void 0 !== r ? r : this.lastNeed <= e.length ? (e.copy(this.lastChar, t, 0, this.lastNeed), 
        this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (e.copy(this.lastChar, t, 0, e.length), 
        void (this.lastNeed -= e.length));
    }
    function f(e, t) {
        if ((e.length - t) % 2 == 0) {
            var r = e.toString("utf16le", t);
            if (r) {
                var n = r.charCodeAt(r.length - 1);
                if (n >= 55296 && n <= 56319) return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = e[e.length - 2], 
                this.lastChar[1] = e[e.length - 1], r.slice(0, -1);
            }
            return r;
        }
        return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = e[e.length - 1], 
        e.toString("utf16le", t, e.length - 1);
    }
    function c(e) {
        var t = e && e.length ? this.write(e) : "";
        if (this.lastNeed) {
            var r = this.lastTotal - this.lastNeed;
            return t + this.lastChar.toString("utf16le", 0, r);
        }
        return t;
    }
    function u(e, t) {
        var r = (e.length - t) % 3;
        return 0 === r ? e.toString("base64", t) : (this.lastNeed = 3 - r, this.lastTotal = 3, 
        1 === r ? this.lastChar[0] = e[e.length - 1] : (this.lastChar[0] = e[e.length - 2], 
        this.lastChar[1] = e[e.length - 1]), e.toString("base64", t, e.length - r));
    }
    function d(e) {
        var t = e && e.length ? this.write(e) : "";
        return this.lastNeed ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t;
    }
    function h(e) {
        return e.toString(this.encoding);
    }
    function l(e) {
        return e && e.length ? this.write(e) : "";
    }
    t.StringDecoder = o, o.prototype.write = function(e) {
        if (0 === e.length) return "";
        var t, r;
        if (this.lastNeed) {
            if (void 0 === (t = this.fillLast(e))) return "";
            r = this.lastNeed, this.lastNeed = 0;
        } else r = 0;
        return r < e.length ? t ? t + this.text(e, r) : this.text(e, r) : t || "";
    }, o.prototype.end = function(e) {
        var t = e && e.length ? this.write(e) : "";
        return this.lastNeed ? t + "�" : t;
    }, o.prototype.text = function(e, t) {
        var r = function(e, t, r) {
            var n = t.length - 1;
            if (n < r) return 0;
            var i = a(t[n]);
            if (i >= 0) return i > 0 && (e.lastNeed = i - 1), i;
            if (--n < r || -2 === i) return 0;
            if ((i = a(t[n])) >= 0) return i > 0 && (e.lastNeed = i - 2), i;
            if (--n < r || -2 === i) return 0;
            if ((i = a(t[n])) >= 0) return i > 0 && (2 === i ? i = 0 : e.lastNeed = i - 3), 
            i;
            return 0;
        }(this, e, t);
        if (!this.lastNeed) return e.toString("utf8", t);
        this.lastTotal = r;
        var n = e.length - (r - this.lastNeed);
        return e.copy(this.lastChar, 0, n), e.toString("utf8", t, n);
    }, o.prototype.fillLast = function(e) {
        if (this.lastNeed <= e.length) return e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), 
        this.lastChar.toString(this.encoding, 0, this.lastTotal);
        e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length), this.lastNeed -= e.length;
    };
}, function(e, t, r) {
    "use strict";
    e.exports = a;
    var n = r(32), i = Object.create(r(27));
    function o(e, t) {
        var r = this._transformState;
        r.transforming = !1;
        var n = r.writecb;
        if (!n) return this.emit("error", new Error("write callback called multiple times"));
        r.writechunk = null, r.writecb = null, null != t && this.push(t), n(e);
        var i = this._readableState;
        i.reading = !1, (i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
    }
    function a(e) {
        if (!(this instanceof a)) return new a(e);
        n.call(this, e), this._transformState = {
            afterTransform: o.bind(this),
            needTransform: !1,
            transforming: !1,
            writecb: null,
            writechunk: null,
            writeencoding: null
        }, this._readableState.needReadable = !0, this._readableState.sync = !1, e && ("function" == typeof e.transform && (this._transform = e.transform), 
        "function" == typeof e.flush && (this._flush = e.flush)), this.on("prefinish", s);
    }
    function s() {
        var e = this;
        "function" == typeof this._flush ? this._flush((function(t, r) {
            f(e, t, r);
        })) : f(this, null, null);
    }
    function f(e, t, r) {
        if (t) return e.emit("error", t);
        if (null != r && e.push(r), e._writableState.length) throw new Error("Calling transform done when ws.length != 0");
        if (e._transformState.transforming) throw new Error("Calling transform done when still transforming");
        return e.push(null);
    }
    i.inherits = r(17), i.inherits(a, n), a.prototype.push = function(e, t) {
        return this._transformState.needTransform = !1, n.prototype.push.call(this, e, t);
    }, a.prototype._transform = function(e, t, r) {
        throw new Error("_transform() is not implemented");
    }, a.prototype._write = function(e, t, r) {
        var n = this._transformState;
        if (n.writecb = r, n.writechunk = e, n.writeencoding = t, !n.transforming) {
            var i = this._readableState;
            (n.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
        }
    }, a.prototype._read = function(e) {
        var t = this._transformState;
        null !== t.writechunk && t.writecb && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) : t.needTransform = !0;
    }, a.prototype._destroy = function(e, t) {
        var r = this;
        n.prototype._destroy.call(this, e, (function(e) {
            t(e), r.emit("close");
        }));
    };
}, function(e, t, r) {
    "use strict";
    e.exports = o;
    var n = r(38), i = Object.create(r(27));
    function o(e) {
        if (!(this instanceof o)) return new o(e);
        n.call(this, e);
    }
    i.inherits = r(17), i.inherits(o, n), o.prototype._transform = function(e, t, r) {
        r(null, e);
    };
}, function(e, t, r) {
    e.exports = r(33);
}, function(e, t, r) {
    e.exports = r(32);
}, function(e, t, r) {
    e.exports = r(22).Transform;
}, function(e, t, r) {
    e.exports = r(22).PassThrough;
}, function(e, t, r) {
    "use strict";
    var n = r(12).Buffer, i = r(17), o = r(19), a = new Array(16), s = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13 ], f = [ 5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11 ], c = [ 11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6 ], u = [ 8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11 ], d = [ 0, 1518500249, 1859775393, 2400959708, 2840853838 ], h = [ 1352829926, 1548603684, 1836072691, 2053994217, 0 ];
    function l() {
        o.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, 
        this._d = 271733878, this._e = 3285377520;
    }
    function p(e, t) {
        return e << t | e >>> 32 - t;
    }
    function b(e, t, r, n, i, o, a, s) {
        return p(e + (t ^ r ^ n) + o + a | 0, s) + i | 0;
    }
    function m(e, t, r, n, i, o, a, s) {
        return p(e + (t & r | ~t & n) + o + a | 0, s) + i | 0;
    }
    function g(e, t, r, n, i, o, a, s) {
        return p(e + ((t | ~r) ^ n) + o + a | 0, s) + i | 0;
    }
    function y(e, t, r, n, i, o, a, s) {
        return p(e + (t & n | r & ~n) + o + a | 0, s) + i | 0;
    }
    function v(e, t, r, n, i, o, a, s) {
        return p(e + (t ^ (r | ~n)) + o + a | 0, s) + i | 0;
    }
    i(l, o), l.prototype._update = function() {
        for (var e = a, t = 0; t < 16; ++t) e[t] = this._block.readInt32LE(4 * t);
        for (var r = 0 | this._a, n = 0 | this._b, i = 0 | this._c, o = 0 | this._d, l = 0 | this._e, w = 0 | this._a, _ = 0 | this._b, x = 0 | this._c, S = 0 | this._d, A = 0 | this._e, E = 0; E < 80; E += 1) {
            var M, k;
            E < 16 ? (M = b(r, n, i, o, l, e[s[E]], d[0], c[E]), k = v(w, _, x, S, A, e[f[E]], h[0], u[E])) : E < 32 ? (M = m(r, n, i, o, l, e[s[E]], d[1], c[E]), 
            k = y(w, _, x, S, A, e[f[E]], h[1], u[E])) : E < 48 ? (M = g(r, n, i, o, l, e[s[E]], d[2], c[E]), 
            k = g(w, _, x, S, A, e[f[E]], h[2], u[E])) : E < 64 ? (M = y(r, n, i, o, l, e[s[E]], d[3], c[E]), 
            k = m(w, _, x, S, A, e[f[E]], h[3], u[E])) : (M = v(r, n, i, o, l, e[s[E]], d[4], c[E]), 
            k = b(w, _, x, S, A, e[f[E]], h[4], u[E])), r = l, l = o, o = p(i, 10), i = n, n = M, 
            w = A, A = S, S = p(x, 10), x = _, _ = k;
        }
        var C = this._b + i + S | 0;
        this._b = this._c + o + A | 0, this._c = this._d + l + w | 0, this._d = this._e + r + _ | 0, 
        this._e = this._a + n + x | 0, this._a = C;
    }, l.prototype._digest = function() {
        this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), 
        this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), 
        this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), 
        this._update();
        var e = n.alloc ? n.alloc(20) : new n(20);
        return e.writeInt32LE(this._a, 0), e.writeInt32LE(this._b, 4), e.writeInt32LE(this._c, 8), 
        e.writeInt32LE(this._d, 12), e.writeInt32LE(this._e, 16), e;
    }, e.exports = l;
}, function(e, t, r) {
    (t = e.exports = function(e) {
        e = e.toLowerCase();
        var r = t[e];
        if (!r) throw new Error(e + " is not supported (we accept pull requests)");
        return new r;
    }).sha = r(46), t.sha1 = r(48), t.sha224 = r(49), t.sha256 = r(50), t.sha384 = r(51), 
    t.sha512 = r(52);
}, function(e, t, r) {
    var n = r(17), i = r(47), o = r(11).Buffer, a = [ 1518500249, 1859775393, -1894007588, -899497514 ], s = new Array(80);
    function f() {
        this.init(), this._w = s, i.call(this, 64, 56);
    }
    function c(e) {
        return e << 30 | e >>> 2;
    }
    function u(e, t, r, n) {
        return 0 === e ? t & r | ~t & n : 2 === e ? t & r | t & n | r & n : t ^ r ^ n;
    }
    n(f, i), f.prototype.init = function() {
        return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, 
        this._e = 3285377520, this;
    }, f.prototype._update = function(e) {
        for (var t, r = this._w, n = 0 | this._a, i = 0 | this._b, o = 0 | this._c, s = 0 | this._d, f = 0 | this._e, d = 0; d < 16; ++d) r[d] = e.readInt32BE(4 * d);
        for (;d < 80; ++d) r[d] = r[d - 3] ^ r[d - 8] ^ r[d - 14] ^ r[d - 16];
        for (var h = 0; h < 80; ++h) {
            var l = ~~(h / 20), p = 0 | ((t = n) << 5 | t >>> 27) + u(l, i, o, s) + f + r[h] + a[l];
            f = s, s = o, o = c(i), i = n, n = p;
        }
        this._a = n + this._a | 0, this._b = i + this._b | 0, this._c = o + this._c | 0, 
        this._d = s + this._d | 0, this._e = f + this._e | 0;
    }, f.prototype._hash = function() {
        var e = o.allocUnsafe(20);
        return e.writeInt32BE(0 | this._a, 0), e.writeInt32BE(0 | this._b, 4), e.writeInt32BE(0 | this._c, 8), 
        e.writeInt32BE(0 | this._d, 12), e.writeInt32BE(0 | this._e, 16), e;
    }, e.exports = f;
}, function(e, t, r) {
    var n = r(11).Buffer;
    function i(e, t) {
        this._block = n.alloc(e), this._finalSize = t, this._blockSize = e, this._len = 0;
    }
    i.prototype.update = function(e, t) {
        "string" == typeof e && (t = t || "utf8", e = n.from(e, t));
        for (var r = this._block, i = this._blockSize, o = e.length, a = this._len, s = 0; s < o; ) {
            for (var f = a % i, c = Math.min(o - s, i - f), u = 0; u < c; u++) r[f + u] = e[s + u];
            s += c, (a += c) % i == 0 && this._update(r);
        }
        return this._len += o, this;
    }, i.prototype.digest = function(e) {
        var t = this._len % this._blockSize;
        this._block[t] = 128, this._block.fill(0, t + 1), t >= this._finalSize && (this._update(this._block), 
        this._block.fill(0));
        var r = 8 * this._len;
        if (r <= 4294967295) this._block.writeUInt32BE(r, this._blockSize - 4); else {
            var n = (4294967295 & r) >>> 0, i = (r - n) / 4294967296;
            this._block.writeUInt32BE(i, this._blockSize - 8), this._block.writeUInt32BE(n, this._blockSize - 4);
        }
        this._update(this._block);
        var o = this._hash();
        return e ? o.toString(e) : o;
    }, i.prototype._update = function() {
        throw new Error("_update must be implemented by subclass");
    }, e.exports = i;
}, function(e, t, r) {
    var n = r(17), i = r(47), o = r(11).Buffer, a = [ 1518500249, 1859775393, -1894007588, -899497514 ], s = new Array(80);
    function f() {
        this.init(), this._w = s, i.call(this, 64, 56);
    }
    function c(e) {
        return e << 5 | e >>> 27;
    }
    function u(e) {
        return e << 30 | e >>> 2;
    }
    function d(e, t, r, n) {
        return 0 === e ? t & r | ~t & n : 2 === e ? t & r | t & n | r & n : t ^ r ^ n;
    }
    n(f, i), f.prototype.init = function() {
        return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, 
        this._e = 3285377520, this;
    }, f.prototype._update = function(e) {
        for (var t, r = this._w, n = 0 | this._a, i = 0 | this._b, o = 0 | this._c, s = 0 | this._d, f = 0 | this._e, h = 0; h < 16; ++h) r[h] = e.readInt32BE(4 * h);
        for (;h < 80; ++h) r[h] = (t = r[h - 3] ^ r[h - 8] ^ r[h - 14] ^ r[h - 16]) << 1 | t >>> 31;
        for (var l = 0; l < 80; ++l) {
            var p = ~~(l / 20), b = c(n) + d(p, i, o, s) + f + r[l] + a[p] | 0;
            f = s, s = o, o = u(i), i = n, n = b;
        }
        this._a = n + this._a | 0, this._b = i + this._b | 0, this._c = o + this._c | 0, 
        this._d = s + this._d | 0, this._e = f + this._e | 0;
    }, f.prototype._hash = function() {
        var e = o.allocUnsafe(20);
        return e.writeInt32BE(0 | this._a, 0), e.writeInt32BE(0 | this._b, 4), e.writeInt32BE(0 | this._c, 8), 
        e.writeInt32BE(0 | this._d, 12), e.writeInt32BE(0 | this._e, 16), e;
    }, e.exports = f;
}, function(e, t, r) {
    var n = r(17), i = r(50), o = r(47), a = r(11).Buffer, s = new Array(64);
    function f() {
        this.init(), this._w = s, o.call(this, 64, 56);
    }
    n(f, i), f.prototype.init = function() {
        return this._a = 3238371032, this._b = 914150663, this._c = 812702999, this._d = 4144912697, 
        this._e = 4290775857, this._f = 1750603025, this._g = 1694076839, this._h = 3204075428, 
        this;
    }, f.prototype._hash = function() {
        var e = a.allocUnsafe(28);
        return e.writeInt32BE(this._a, 0), e.writeInt32BE(this._b, 4), e.writeInt32BE(this._c, 8), 
        e.writeInt32BE(this._d, 12), e.writeInt32BE(this._e, 16), e.writeInt32BE(this._f, 20), 
        e.writeInt32BE(this._g, 24), e;
    }, e.exports = f;
}, function(e, t, r) {
    var n = r(17), i = r(47), o = r(11).Buffer, a = [ 1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298 ], s = new Array(64);
    function f() {
        this.init(), this._w = s, i.call(this, 64, 56);
    }
    function c(e, t, r) {
        return r ^ e & (t ^ r);
    }
    function u(e, t, r) {
        return e & t | r & (e | t);
    }
    function d(e) {
        return (e >>> 2 | e << 30) ^ (e >>> 13 | e << 19) ^ (e >>> 22 | e << 10);
    }
    function h(e) {
        return (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
    }
    function l(e) {
        return (e >>> 7 | e << 25) ^ (e >>> 18 | e << 14) ^ e >>> 3;
    }
    n(f, i), f.prototype.init = function() {
        return this._a = 1779033703, this._b = 3144134277, this._c = 1013904242, this._d = 2773480762, 
        this._e = 1359893119, this._f = 2600822924, this._g = 528734635, this._h = 1541459225, 
        this;
    }, f.prototype._update = function(e) {
        for (var t, r = this._w, n = 0 | this._a, i = 0 | this._b, o = 0 | this._c, s = 0 | this._d, f = 0 | this._e, p = 0 | this._f, b = 0 | this._g, m = 0 | this._h, g = 0; g < 16; ++g) r[g] = e.readInt32BE(4 * g);
        for (;g < 64; ++g) r[g] = 0 | (((t = r[g - 2]) >>> 17 | t << 15) ^ (t >>> 19 | t << 13) ^ t >>> 10) + r[g - 7] + l(r[g - 15]) + r[g - 16];
        for (var y = 0; y < 64; ++y) {
            var v = m + h(f) + c(f, p, b) + a[y] + r[y] | 0, w = d(n) + u(n, i, o) | 0;
            m = b, b = p, p = f, f = s + v | 0, s = o, o = i, i = n, n = v + w | 0;
        }
        this._a = n + this._a | 0, this._b = i + this._b | 0, this._c = o + this._c | 0, 
        this._d = s + this._d | 0, this._e = f + this._e | 0, this._f = p + this._f | 0, 
        this._g = b + this._g | 0, this._h = m + this._h | 0;
    }, f.prototype._hash = function() {
        var e = o.allocUnsafe(32);
        return e.writeInt32BE(this._a, 0), e.writeInt32BE(this._b, 4), e.writeInt32BE(this._c, 8), 
        e.writeInt32BE(this._d, 12), e.writeInt32BE(this._e, 16), e.writeInt32BE(this._f, 20), 
        e.writeInt32BE(this._g, 24), e.writeInt32BE(this._h, 28), e;
    }, e.exports = f;
}, function(e, t, r) {
    var n = r(17), i = r(52), o = r(47), a = r(11).Buffer, s = new Array(160);
    function f() {
        this.init(), this._w = s, o.call(this, 128, 112);
    }
    n(f, i), f.prototype.init = function() {
        return this._ah = 3418070365, this._bh = 1654270250, this._ch = 2438529370, this._dh = 355462360, 
        this._eh = 1731405415, this._fh = 2394180231, this._gh = 3675008525, this._hh = 1203062813, 
        this._al = 3238371032, this._bl = 914150663, this._cl = 812702999, this._dl = 4144912697, 
        this._el = 4290775857, this._fl = 1750603025, this._gl = 1694076839, this._hl = 3204075428, 
        this;
    }, f.prototype._hash = function() {
        var e = a.allocUnsafe(48);
        function t(t, r, n) {
            e.writeInt32BE(t, n), e.writeInt32BE(r, n + 4);
        }
        return t(this._ah, this._al, 0), t(this._bh, this._bl, 8), t(this._ch, this._cl, 16), 
        t(this._dh, this._dl, 24), t(this._eh, this._el, 32), t(this._fh, this._fl, 40), 
        e;
    }, e.exports = f;
}, function(e, t, r) {
    var n = r(17), i = r(47), o = r(11).Buffer, a = [ 1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591 ], s = new Array(160);
    function f() {
        this.init(), this._w = s, i.call(this, 128, 112);
    }
    function c(e, t, r) {
        return r ^ e & (t ^ r);
    }
    function u(e, t, r) {
        return e & t | r & (e | t);
    }
    function d(e, t) {
        return (e >>> 28 | t << 4) ^ (t >>> 2 | e << 30) ^ (t >>> 7 | e << 25);
    }
    function h(e, t) {
        return (e >>> 14 | t << 18) ^ (e >>> 18 | t << 14) ^ (t >>> 9 | e << 23);
    }
    function l(e, t) {
        return (e >>> 1 | t << 31) ^ (e >>> 8 | t << 24) ^ e >>> 7;
    }
    function p(e, t) {
        return (e >>> 1 | t << 31) ^ (e >>> 8 | t << 24) ^ (e >>> 7 | t << 25);
    }
    function b(e, t) {
        return (e >>> 19 | t << 13) ^ (t >>> 29 | e << 3) ^ e >>> 6;
    }
    function m(e, t) {
        return (e >>> 19 | t << 13) ^ (t >>> 29 | e << 3) ^ (e >>> 6 | t << 26);
    }
    function g(e, t) {
        return e >>> 0 < t >>> 0 ? 1 : 0;
    }
    n(f, i), f.prototype.init = function() {
        return this._ah = 1779033703, this._bh = 3144134277, this._ch = 1013904242, this._dh = 2773480762, 
        this._eh = 1359893119, this._fh = 2600822924, this._gh = 528734635, this._hh = 1541459225, 
        this._al = 4089235720, this._bl = 2227873595, this._cl = 4271175723, this._dl = 1595750129, 
        this._el = 2917565137, this._fl = 725511199, this._gl = 4215389547, this._hl = 327033209, 
        this;
    }, f.prototype._update = function(e) {
        for (var t = this._w, r = 0 | this._ah, n = 0 | this._bh, i = 0 | this._ch, o = 0 | this._dh, s = 0 | this._eh, f = 0 | this._fh, y = 0 | this._gh, v = 0 | this._hh, w = 0 | this._al, _ = 0 | this._bl, x = 0 | this._cl, S = 0 | this._dl, A = 0 | this._el, E = 0 | this._fl, M = 0 | this._gl, k = 0 | this._hl, C = 0; C < 32; C += 2) t[C] = e.readInt32BE(4 * C), 
        t[C + 1] = e.readInt32BE(4 * C + 4);
        for (;C < 160; C += 2) {
            var T = t[C - 30], I = t[C - 30 + 1], B = l(T, I), j = p(I, T), R = b(T = t[C - 4], I = t[C - 4 + 1]), D = m(I, T), P = t[C - 14], q = t[C - 14 + 1], N = t[C - 32], O = t[C - 32 + 1], L = j + q | 0, U = B + P + g(L, j) | 0;
            U = (U = U + R + g(L = L + D | 0, D) | 0) + N + g(L = L + O | 0, O) | 0, t[C] = U, 
            t[C + 1] = L;
        }
        for (var z = 0; z < 160; z += 2) {
            U = t[z], L = t[z + 1];
            var H = u(r, n, i), F = u(w, _, x), W = d(r, w), K = d(w, r), Y = h(s, A), V = h(A, s), J = a[z], G = a[z + 1], X = c(s, f, y), $ = c(A, E, M), Z = k + V | 0, Q = v + Y + g(Z, k) | 0;
            Q = (Q = (Q = Q + X + g(Z = Z + $ | 0, $) | 0) + J + g(Z = Z + G | 0, G) | 0) + U + g(Z = Z + L | 0, L) | 0;
            var ee = K + F | 0, te = W + H + g(ee, K) | 0;
            v = y, k = M, y = f, M = E, f = s, E = A, s = o + Q + g(A = S + Z | 0, S) | 0, o = i, 
            S = x, i = n, x = _, n = r, _ = w, r = Q + te + g(w = Z + ee | 0, Z) | 0;
        }
        this._al = this._al + w | 0, this._bl = this._bl + _ | 0, this._cl = this._cl + x | 0, 
        this._dl = this._dl + S | 0, this._el = this._el + A | 0, this._fl = this._fl + E | 0, 
        this._gl = this._gl + M | 0, this._hl = this._hl + k | 0, this._ah = this._ah + r + g(this._al, w) | 0, 
        this._bh = this._bh + n + g(this._bl, _) | 0, this._ch = this._ch + i + g(this._cl, x) | 0, 
        this._dh = this._dh + o + g(this._dl, S) | 0, this._eh = this._eh + s + g(this._el, A) | 0, 
        this._fh = this._fh + f + g(this._fl, E) | 0, this._gh = this._gh + y + g(this._gl, M) | 0, 
        this._hh = this._hh + v + g(this._hl, k) | 0;
    }, f.prototype._hash = function() {
        var e = o.allocUnsafe(64);
        function t(t, r, n) {
            e.writeInt32BE(t, n), e.writeInt32BE(r, n + 4);
        }
        return t(this._ah, this._al, 0), t(this._bh, this._bl, 8), t(this._ch, this._cl, 16), 
        t(this._dh, this._dl, 24), t(this._eh, this._el, 32), t(this._fh, this._fl, 40), 
        t(this._gh, this._gl, 48), t(this._hh, this._hl, 56), e;
    }, e.exports = f;
}, function(e, t, r) {
    var n = r(11).Buffer, i = r(20).Transform, o = r(37).StringDecoder;
    function a(e) {
        i.call(this), this.hashMode = "string" == typeof e, this.hashMode ? this[e] = this._finalOrDigest : this.final = this._finalOrDigest, 
        this._final && (this.__final = this._final, this._final = null), this._decoder = null, 
        this._encoding = null;
    }
    r(17)(a, i), a.prototype.update = function(e, t, r) {
        "string" == typeof e && (e = n.from(e, t));
        var i = this._update(e);
        return this.hashMode ? this : (r && (i = this._toString(i, r)), i);
    }, a.prototype.setAutoPadding = function() {}, a.prototype.getAuthTag = function() {
        throw new Error("trying to get auth tag in unsupported state");
    }, a.prototype.setAuthTag = function() {
        throw new Error("trying to set auth tag in unsupported state");
    }, a.prototype.setAAD = function() {
        throw new Error("trying to set aad in unsupported state");
    }, a.prototype._transform = function(e, t, r) {
        var n;
        try {
            this.hashMode ? this._update(e) : this.push(this._update(e));
        } catch (e) {
            n = e;
        } finally {
            r(n);
        }
    }, a.prototype._flush = function(e) {
        var t;
        try {
            this.push(this.__final());
        } catch (e) {
            t = e;
        }
        e(t);
    }, a.prototype._finalOrDigest = function(e) {
        var t = this.__final() || n.alloc(0);
        return e && (t = this._toString(t, e, !0)), t;
    }, a.prototype._toString = function(e, t, r) {
        if (this._decoder || (this._decoder = new o(t), this._encoding = t), this._encoding !== t) throw new Error("can't switch encodings");
        var n = this._decoder.write(e);
        return r && (n += this._decoder.end()), n;
    }, e.exports = a;
}, function(e, t, r) {
    "use strict";
    var n = r(17), i = r(55), o = r(53), a = r(11).Buffer, s = r(56), f = r(44), c = r(45), u = a.alloc(128);
    function d(e, t) {
        o.call(this, "digest"), "string" == typeof t && (t = a.from(t));
        var r = "sha512" === e || "sha384" === e ? 128 : 64;
        (this._alg = e, this._key = t, t.length > r) ? t = ("rmd160" === e ? new f : c(e)).update(t).digest() : t.length < r && (t = a.concat([ t, u ], r));
        for (var n = this._ipad = a.allocUnsafe(r), i = this._opad = a.allocUnsafe(r), s = 0; s < r; s++) n[s] = 54 ^ t[s], 
        i[s] = 92 ^ t[s];
        this._hash = "rmd160" === e ? new f : c(e), this._hash.update(n);
    }
    n(d, o), d.prototype._update = function(e) {
        this._hash.update(e);
    }, d.prototype._final = function() {
        var e = this._hash.digest();
        return ("rmd160" === this._alg ? new f : c(this._alg)).update(this._opad).update(e).digest();
    }, e.exports = function(e, t) {
        return "rmd160" === (e = e.toLowerCase()) || "ripemd160" === e ? new d("rmd160", t) : "md5" === e ? new i(s, t) : new d(e, t);
    };
}, function(e, t, r) {
    "use strict";
    var n = r(17), i = r(11).Buffer, o = r(53), a = i.alloc(128);
    function s(e, t) {
        o.call(this, "digest"), "string" == typeof t && (t = i.from(t)), this._alg = e, 
        this._key = t, t.length > 64 ? t = e(t) : t.length < 64 && (t = i.concat([ t, a ], 64));
        for (var r = this._ipad = i.allocUnsafe(64), n = this._opad = i.allocUnsafe(64), s = 0; s < 64; s++) r[s] = 54 ^ t[s], 
        n[s] = 92 ^ t[s];
        this._hash = [ r ];
    }
    n(s, o), s.prototype._update = function(e) {
        this._hash.push(e);
    }, s.prototype._final = function() {
        var e = this._alg(i.concat(this._hash));
        return this._alg(i.concat([ this._opad, e ]));
    }, e.exports = s;
}, function(e, t, r) {
    var n = r(18);
    e.exports = function(e) {
        return (new n).update(e).digest();
    };
}, function(e, t, r) {
    e.exports = r(58);
}, function(e) {
    e.exports = JSON.parse('{"sha224WithRSAEncryption":{"sign":"rsa","hash":"sha224","id":"302d300d06096086480165030402040500041c"},"RSA-SHA224":{"sign":"ecdsa/rsa","hash":"sha224","id":"302d300d06096086480165030402040500041c"},"sha256WithRSAEncryption":{"sign":"rsa","hash":"sha256","id":"3031300d060960864801650304020105000420"},"RSA-SHA256":{"sign":"ecdsa/rsa","hash":"sha256","id":"3031300d060960864801650304020105000420"},"sha384WithRSAEncryption":{"sign":"rsa","hash":"sha384","id":"3041300d060960864801650304020205000430"},"RSA-SHA384":{"sign":"ecdsa/rsa","hash":"sha384","id":"3041300d060960864801650304020205000430"},"sha512WithRSAEncryption":{"sign":"rsa","hash":"sha512","id":"3051300d060960864801650304020305000440"},"RSA-SHA512":{"sign":"ecdsa/rsa","hash":"sha512","id":"3051300d060960864801650304020305000440"},"RSA-SHA1":{"sign":"rsa","hash":"sha1","id":"3021300906052b0e03021a05000414"},"ecdsa-with-SHA1":{"sign":"ecdsa","hash":"sha1","id":""},"sha256":{"sign":"ecdsa","hash":"sha256","id":""},"sha224":{"sign":"ecdsa","hash":"sha224","id":""},"sha384":{"sign":"ecdsa","hash":"sha384","id":""},"sha512":{"sign":"ecdsa","hash":"sha512","id":""},"DSA-SHA":{"sign":"dsa","hash":"sha1","id":""},"DSA-SHA1":{"sign":"dsa","hash":"sha1","id":""},"DSA":{"sign":"dsa","hash":"sha1","id":""},"DSA-WITH-SHA224":{"sign":"dsa","hash":"sha224","id":""},"DSA-SHA224":{"sign":"dsa","hash":"sha224","id":""},"DSA-WITH-SHA256":{"sign":"dsa","hash":"sha256","id":""},"DSA-SHA256":{"sign":"dsa","hash":"sha256","id":""},"DSA-WITH-SHA384":{"sign":"dsa","hash":"sha384","id":""},"DSA-SHA384":{"sign":"dsa","hash":"sha384","id":""},"DSA-WITH-SHA512":{"sign":"dsa","hash":"sha512","id":""},"DSA-SHA512":{"sign":"dsa","hash":"sha512","id":""},"DSA-RIPEMD160":{"sign":"dsa","hash":"rmd160","id":""},"ripemd160WithRSA":{"sign":"rsa","hash":"rmd160","id":"3021300906052b2403020105000414"},"RSA-RIPEMD160":{"sign":"rsa","hash":"rmd160","id":"3021300906052b2403020105000414"},"md5WithRSAEncryption":{"sign":"rsa","hash":"md5","id":"3020300c06082a864886f70d020505000410"},"RSA-MD5":{"sign":"rsa","hash":"md5","id":"3020300c06082a864886f70d020505000410"}}');
}, function(e, t, r) {
    t.pbkdf2 = r(60), t.pbkdf2Sync = r(63);
}, function(e, t, r) {
    (function(t, n) {
        var i, o = r(61), a = r(62), s = r(63), f = r(11).Buffer, c = t.crypto && t.crypto.subtle, u = {
            sha: "SHA-1",
            "sha-1": "SHA-1",
            sha1: "SHA-1",
            sha256: "SHA-256",
            "sha-256": "SHA-256",
            sha384: "SHA-384",
            "sha-384": "SHA-384",
            "sha-512": "SHA-512",
            sha512: "SHA-512"
        }, d = [];
        function h(e, t, r, n, i) {
            return c.importKey("raw", e, {
                name: "PBKDF2"
            }, !1, [ "deriveBits" ]).then((function(e) {
                return c.deriveBits({
                    name: "PBKDF2",
                    salt: t,
                    iterations: r,
                    hash: {
                        name: i
                    }
                }, e, n << 3);
            })).then((function(e) {
                return f.from(e);
            }));
        }
        e.exports = function(e, r, l, p, b, m) {
            "function" == typeof b && (m = b, b = void 0);
            var g = u[(b = b || "sha1").toLowerCase()];
            if (!g || "function" != typeof t.Promise) return n.nextTick((function() {
                var t;
                try {
                    t = s(e, r, l, p, b);
                } catch (e) {
                    return m(e);
                }
                m(null, t);
            }));
            if (o(e, r, l, p), "function" != typeof m) throw new Error("No callback provided to pbkdf2");
            f.isBuffer(e) || (e = f.from(e, a)), f.isBuffer(r) || (r = f.from(r, a)), function(e, t) {
                e.then((function(e) {
                    n.nextTick((function() {
                        t(null, e);
                    }));
                }), (function(e) {
                    n.nextTick((function() {
                        t(e);
                    }));
                }));
            }(function(e) {
                if (t.process && !t.process.browser) return Promise.resolve(!1);
                if (!c || !c.importKey || !c.deriveBits) return Promise.resolve(!1);
                if (void 0 !== d[e]) return d[e];
                var r = h(i = i || f.alloc(8), i, 10, 128, e).then((function() {
                    return !0;
                })).catch((function() {
                    return !1;
                }));
                return d[e] = r, r;
            }(g).then((function(t) {
                return t ? h(e, r, l, p, g) : s(e, r, l, p, b);
            })), m);
        };
    }).call(this, r(3), r(10));
}, function(e, t, r) {
    (function(t) {
        var r = Math.pow(2, 30) - 1;
        function n(e, r) {
            if ("string" != typeof e && !t.isBuffer(e)) throw new TypeError(r + " must be a buffer or string");
        }
        e.exports = function(e, t, i, o) {
            if (n(e, "Password"), n(t, "Salt"), "number" != typeof i) throw new TypeError("Iterations not a number");
            if (i < 0) throw new TypeError("Bad iterations");
            if ("number" != typeof o) throw new TypeError("Key length not a number");
            if (o < 0 || o > r || o != o) throw new TypeError("Bad key length");
        };
    }).call(this, r(12).Buffer);
}, function(e, t, r) {
    (function(t) {
        var r;
        t.browser ? r = "utf-8" : r = parseInt(t.version.split(".")[0].slice(1), 10) >= 6 ? "utf-8" : "binary";
        e.exports = r;
    }).call(this, r(10));
}, function(e, t, r) {
    var n = r(56), i = r(44), o = r(45), a = r(61), s = r(62), f = r(11).Buffer, c = f.alloc(128), u = {
        md5: 16,
        sha1: 20,
        sha224: 28,
        sha256: 32,
        sha384: 48,
        sha512: 64,
        rmd160: 20,
        ripemd160: 20
    };
    function d(e, t, r) {
        var a = function(e) {
            function t(t) {
                return o(e).update(t).digest();
            }
            return "rmd160" === e || "ripemd160" === e ? function(e) {
                return (new i).update(e).digest();
            } : "md5" === e ? n : t;
        }(e), s = "sha512" === e || "sha384" === e ? 128 : 64;
        t.length > s ? t = a(t) : t.length < s && (t = f.concat([ t, c ], s));
        for (var d = f.allocUnsafe(s + u[e]), h = f.allocUnsafe(s + u[e]), l = 0; l < s; l++) d[l] = 54 ^ t[l], 
        h[l] = 92 ^ t[l];
        var p = f.allocUnsafe(s + r + 4);
        d.copy(p, 0, 0, s), this.ipad1 = p, this.ipad2 = d, this.opad = h, this.alg = e, 
        this.blocksize = s, this.hash = a, this.size = u[e];
    }
    d.prototype.run = function(e, t) {
        return e.copy(t, this.blocksize), this.hash(t).copy(this.opad, this.blocksize), 
        this.hash(this.opad);
    }, e.exports = function(e, t, r, n, i) {
        a(e, t, r, n), f.isBuffer(e) || (e = f.from(e, s)), f.isBuffer(t) || (t = f.from(t, s));
        var o = new d(i = i || "sha1", e, t.length), c = f.allocUnsafe(n), h = f.allocUnsafe(t.length + 4);
        t.copy(h, 0, 0, t.length);
        for (var l = 0, p = u[i], b = Math.ceil(n / p), m = 1; m <= b; m++) {
            h.writeUInt32BE(m, t.length);
            for (var g = o.run(h, o.ipad1), y = g, v = 1; v < r; v++) {
                y = o.run(y, o.ipad2);
                for (var w = 0; w < p; w++) g[w] ^= y[w];
            }
            g.copy(c, l), l += p;
        }
        return c;
    };
}, function(e, t, r) {
    var n = r(65), i = r(73), o = r(75), a = r(92), s = r(90);
    function f(e, t, r) {
        if (e = e.toLowerCase(), o[e]) return i.createCipheriv(e, t, r);
        if (a[e]) return new n({
            key: t,
            iv: r,
            mode: e
        });
        throw new TypeError("invalid suite type");
    }
    function c(e, t, r) {
        if (e = e.toLowerCase(), o[e]) return i.createDecipheriv(e, t, r);
        if (a[e]) return new n({
            key: t,
            iv: r,
            mode: e,
            decrypt: !0
        });
        throw new TypeError("invalid suite type");
    }
    t.createCipher = t.Cipher = function(e, t) {
        var r, n;
        if (e = e.toLowerCase(), o[e]) r = o[e].key, n = o[e].iv; else {
            if (!a[e]) throw new TypeError("invalid suite type");
            r = 8 * a[e].key, n = a[e].iv;
        }
        var i = s(t, !1, r, n);
        return f(e, i.key, i.iv);
    }, t.createCipheriv = t.Cipheriv = f, t.createDecipher = t.Decipher = function(e, t) {
        var r, n;
        if (e = e.toLowerCase(), o[e]) r = o[e].key, n = o[e].iv; else {
            if (!a[e]) throw new TypeError("invalid suite type");
            r = 8 * a[e].key, n = a[e].iv;
        }
        var i = s(t, !1, r, n);
        return c(e, i.key, i.iv);
    }, t.createDecipheriv = t.Decipheriv = c, t.listCiphers = t.getCiphers = function() {
        return Object.keys(a).concat(i.getCiphers());
    };
}, function(e, t, r) {
    var n = r(53), i = r(66), o = r(17), a = r(11).Buffer, s = {
        "des-ede3-cbc": i.CBC.instantiate(i.EDE),
        "des-ede3": i.EDE,
        "des-ede-cbc": i.CBC.instantiate(i.EDE),
        "des-ede": i.EDE,
        "des-cbc": i.CBC.instantiate(i.DES),
        "des-ecb": i.DES
    };
    function f(e) {
        n.call(this);
        var t, r = e.mode.toLowerCase(), i = s[r];
        t = e.decrypt ? "decrypt" : "encrypt";
        var o = e.key;
        a.isBuffer(o) || (o = a.from(o)), "des-ede" !== r && "des-ede-cbc" !== r || (o = a.concat([ o, o.slice(0, 8) ]));
        var f = e.iv;
        a.isBuffer(f) || (f = a.from(f)), this._des = i.create({
            key: o,
            iv: f,
            type: t
        });
    }
    s.des = s["des-cbc"], s.des3 = s["des-ede3-cbc"], e.exports = f, o(f, n), f.prototype._update = function(e) {
        return a.from(this._des.update(e));
    }, f.prototype._final = function() {
        return a.from(this._des.final());
    };
}, function(e, t, r) {
    "use strict";
    t.utils = r(67), t.Cipher = r(68), t.DES = r(70), t.CBC = r(71), t.EDE = r(72);
}, function(e, t, r) {
    "use strict";
    t.readUInt32BE = function(e, t) {
        return (e[0 + t] << 24 | e[1 + t] << 16 | e[2 + t] << 8 | e[3 + t]) >>> 0;
    }, t.writeUInt32BE = function(e, t, r) {
        e[0 + r] = t >>> 24, e[1 + r] = t >>> 16 & 255, e[2 + r] = t >>> 8 & 255, e[3 + r] = 255 & t;
    }, t.ip = function(e, t, r, n) {
        for (var i = 0, o = 0, a = 6; a >= 0; a -= 2) {
            for (var s = 0; s <= 24; s += 8) i <<= 1, i |= t >>> s + a & 1;
            for (s = 0; s <= 24; s += 8) i <<= 1, i |= e >>> s + a & 1;
        }
        for (a = 6; a >= 0; a -= 2) {
            for (s = 1; s <= 25; s += 8) o <<= 1, o |= t >>> s + a & 1;
            for (s = 1; s <= 25; s += 8) o <<= 1, o |= e >>> s + a & 1;
        }
        r[n + 0] = i >>> 0, r[n + 1] = o >>> 0;
    }, t.rip = function(e, t, r, n) {
        for (var i = 0, o = 0, a = 0; a < 4; a++) for (var s = 24; s >= 0; s -= 8) i <<= 1, 
        i |= t >>> s + a & 1, i <<= 1, i |= e >>> s + a & 1;
        for (a = 4; a < 8; a++) for (s = 24; s >= 0; s -= 8) o <<= 1, o |= t >>> s + a & 1, 
        o <<= 1, o |= e >>> s + a & 1;
        r[n + 0] = i >>> 0, r[n + 1] = o >>> 0;
    }, t.pc1 = function(e, t, r, n) {
        for (var i = 0, o = 0, a = 7; a >= 5; a--) {
            for (var s = 0; s <= 24; s += 8) i <<= 1, i |= t >> s + a & 1;
            for (s = 0; s <= 24; s += 8) i <<= 1, i |= e >> s + a & 1;
        }
        for (s = 0; s <= 24; s += 8) i <<= 1, i |= t >> s + a & 1;
        for (a = 1; a <= 3; a++) {
            for (s = 0; s <= 24; s += 8) o <<= 1, o |= t >> s + a & 1;
            for (s = 0; s <= 24; s += 8) o <<= 1, o |= e >> s + a & 1;
        }
        for (s = 0; s <= 24; s += 8) o <<= 1, o |= e >> s + a & 1;
        r[n + 0] = i >>> 0, r[n + 1] = o >>> 0;
    }, t.r28shl = function(e, t) {
        return e << t & 268435455 | e >>> 28 - t;
    };
    var n = [ 14, 11, 17, 4, 27, 23, 25, 0, 13, 22, 7, 18, 5, 9, 16, 24, 2, 20, 12, 21, 1, 8, 15, 26, 15, 4, 25, 19, 9, 1, 26, 16, 5, 11, 23, 8, 12, 7, 17, 0, 22, 3, 10, 14, 6, 20, 27, 24 ];
    t.pc2 = function(e, t, r, i) {
        for (var o = 0, a = 0, s = n.length >>> 1, f = 0; f < s; f++) o <<= 1, o |= e >>> n[f] & 1;
        for (f = s; f < n.length; f++) a <<= 1, a |= t >>> n[f] & 1;
        r[i + 0] = o >>> 0, r[i + 1] = a >>> 0;
    }, t.expand = function(e, t, r) {
        var n = 0, i = 0;
        n = (1 & e) << 5 | e >>> 27;
        for (var o = 23; o >= 15; o -= 4) n <<= 6, n |= e >>> o & 63;
        for (o = 11; o >= 3; o -= 4) i |= e >>> o & 63, i <<= 6;
        i |= (31 & e) << 1 | e >>> 31, t[r + 0] = n >>> 0, t[r + 1] = i >>> 0;
    };
    var i = [ 14, 0, 4, 15, 13, 7, 1, 4, 2, 14, 15, 2, 11, 13, 8, 1, 3, 10, 10, 6, 6, 12, 12, 11, 5, 9, 9, 5, 0, 3, 7, 8, 4, 15, 1, 12, 14, 8, 8, 2, 13, 4, 6, 9, 2, 1, 11, 7, 15, 5, 12, 11, 9, 3, 7, 14, 3, 10, 10, 0, 5, 6, 0, 13, 15, 3, 1, 13, 8, 4, 14, 7, 6, 15, 11, 2, 3, 8, 4, 14, 9, 12, 7, 0, 2, 1, 13, 10, 12, 6, 0, 9, 5, 11, 10, 5, 0, 13, 14, 8, 7, 10, 11, 1, 10, 3, 4, 15, 13, 4, 1, 2, 5, 11, 8, 6, 12, 7, 6, 12, 9, 0, 3, 5, 2, 14, 15, 9, 10, 13, 0, 7, 9, 0, 14, 9, 6, 3, 3, 4, 15, 6, 5, 10, 1, 2, 13, 8, 12, 5, 7, 14, 11, 12, 4, 11, 2, 15, 8, 1, 13, 1, 6, 10, 4, 13, 9, 0, 8, 6, 15, 9, 3, 8, 0, 7, 11, 4, 1, 15, 2, 14, 12, 3, 5, 11, 10, 5, 14, 2, 7, 12, 7, 13, 13, 8, 14, 11, 3, 5, 0, 6, 6, 15, 9, 0, 10, 3, 1, 4, 2, 7, 8, 2, 5, 12, 11, 1, 12, 10, 4, 14, 15, 9, 10, 3, 6, 15, 9, 0, 0, 6, 12, 10, 11, 1, 7, 13, 13, 8, 15, 9, 1, 4, 3, 5, 14, 11, 5, 12, 2, 7, 8, 2, 4, 14, 2, 14, 12, 11, 4, 2, 1, 12, 7, 4, 10, 7, 11, 13, 6, 1, 8, 5, 5, 0, 3, 15, 15, 10, 13, 3, 0, 9, 14, 8, 9, 6, 4, 11, 2, 8, 1, 12, 11, 7, 10, 1, 13, 14, 7, 2, 8, 13, 15, 6, 9, 15, 12, 0, 5, 9, 6, 10, 3, 4, 0, 5, 14, 3, 12, 10, 1, 15, 10, 4, 15, 2, 9, 7, 2, 12, 6, 9, 8, 5, 0, 6, 13, 1, 3, 13, 4, 14, 14, 0, 7, 11, 5, 3, 11, 8, 9, 4, 14, 3, 15, 2, 5, 12, 2, 9, 8, 5, 12, 15, 3, 10, 7, 11, 0, 14, 4, 1, 10, 7, 1, 6, 13, 0, 11, 8, 6, 13, 4, 13, 11, 0, 2, 11, 14, 7, 15, 4, 0, 9, 8, 1, 13, 10, 3, 14, 12, 3, 9, 5, 7, 12, 5, 2, 10, 15, 6, 8, 1, 6, 1, 6, 4, 11, 11, 13, 13, 8, 12, 1, 3, 4, 7, 10, 14, 7, 10, 9, 15, 5, 6, 0, 8, 15, 0, 14, 5, 2, 9, 3, 2, 12, 13, 1, 2, 15, 8, 13, 4, 8, 6, 10, 15, 3, 11, 7, 1, 4, 10, 12, 9, 5, 3, 6, 14, 11, 5, 0, 0, 14, 12, 9, 7, 2, 7, 2, 11, 1, 4, 14, 1, 7, 9, 4, 12, 10, 14, 8, 2, 13, 0, 15, 6, 12, 10, 9, 13, 0, 15, 3, 3, 5, 5, 6, 8, 11 ];
    t.substitute = function(e, t) {
        for (var r = 0, n = 0; n < 4; n++) {
            r <<= 4, r |= i[64 * n + (e >>> 18 - 6 * n & 63)];
        }
        for (n = 0; n < 4; n++) {
            r <<= 4, r |= i[256 + 64 * n + (t >>> 18 - 6 * n & 63)];
        }
        return r >>> 0;
    };
    var o = [ 16, 25, 12, 11, 3, 20, 4, 15, 31, 17, 9, 6, 27, 14, 1, 22, 30, 24, 8, 18, 0, 5, 29, 23, 13, 19, 2, 26, 10, 21, 28, 7 ];
    t.permute = function(e) {
        for (var t = 0, r = 0; r < o.length; r++) t <<= 1, t |= e >>> o[r] & 1;
        return t >>> 0;
    }, t.padSplit = function(e, t, r) {
        for (var n = e.toString(2); n.length < t; ) n = "0" + n;
        for (var i = [], o = 0; o < t; o += r) i.push(n.slice(o, o + r));
        return i.join(" ");
    };
}, function(e, t, r) {
    "use strict";
    var n = r(69);
    function i(e) {
        this.options = e, this.type = this.options.type, this.blockSize = 8, this._init(), 
        this.buffer = new Array(this.blockSize), this.bufferOff = 0;
    }
    e.exports = i, i.prototype._init = function() {}, i.prototype.update = function(e) {
        return 0 === e.length ? [] : "decrypt" === this.type ? this._updateDecrypt(e) : this._updateEncrypt(e);
    }, i.prototype._buffer = function(e, t) {
        for (var r = Math.min(this.buffer.length - this.bufferOff, e.length - t), n = 0; n < r; n++) this.buffer[this.bufferOff + n] = e[t + n];
        return this.bufferOff += r, r;
    }, i.prototype._flushBuffer = function(e, t) {
        return this._update(this.buffer, 0, e, t), this.bufferOff = 0, this.blockSize;
    }, i.prototype._updateEncrypt = function(e) {
        var t = 0, r = 0, n = (this.bufferOff + e.length) / this.blockSize | 0, i = new Array(n * this.blockSize);
        0 !== this.bufferOff && (t += this._buffer(e, t), this.bufferOff === this.buffer.length && (r += this._flushBuffer(i, r)));
        for (var o = e.length - (e.length - t) % this.blockSize; t < o; t += this.blockSize) this._update(e, t, i, r), 
        r += this.blockSize;
        for (;t < e.length; t++, this.bufferOff++) this.buffer[this.bufferOff] = e[t];
        return i;
    }, i.prototype._updateDecrypt = function(e) {
        for (var t = 0, r = 0, n = Math.ceil((this.bufferOff + e.length) / this.blockSize) - 1, i = new Array(n * this.blockSize); n > 0; n--) t += this._buffer(e, t), 
        r += this._flushBuffer(i, r);
        return t += this._buffer(e, t), i;
    }, i.prototype.final = function(e) {
        var t, r;
        return e && (t = this.update(e)), r = "encrypt" === this.type ? this._finalEncrypt() : this._finalDecrypt(), 
        t ? t.concat(r) : r;
    }, i.prototype._pad = function(e, t) {
        if (0 === t) return !1;
        for (;t < e.length; ) e[t++] = 0;
        return !0;
    }, i.prototype._finalEncrypt = function() {
        if (!this._pad(this.buffer, this.bufferOff)) return [];
        var e = new Array(this.blockSize);
        return this._update(this.buffer, 0, e, 0), e;
    }, i.prototype._unpad = function(e) {
        return e;
    }, i.prototype._finalDecrypt = function() {
        n.equal(this.bufferOff, this.blockSize, "Not enough data to decrypt");
        var e = new Array(this.blockSize);
        return this._flushBuffer(e, 0), this._unpad(e);
    };
}, function(e, t) {
    function r(e, t) {
        if (!e) throw new Error(t || "Assertion failed");
    }
    e.exports = r, r.equal = function(e, t, r) {
        if (e != t) throw new Error(r || "Assertion failed: " + e + " != " + t);
    };
}, function(e, t, r) {
    "use strict";
    var n = r(69), i = r(17), o = r(67), a = r(68);
    function s() {
        this.tmp = new Array(2), this.keys = null;
    }
    function f(e) {
        a.call(this, e);
        var t = new s;
        this._desState = t, this.deriveKeys(t, e.key);
    }
    i(f, a), e.exports = f, f.create = function(e) {
        return new f(e);
    };
    var c = [ 1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1 ];
    f.prototype.deriveKeys = function(e, t) {
        e.keys = new Array(32), n.equal(t.length, this.blockSize, "Invalid key length");
        var r = o.readUInt32BE(t, 0), i = o.readUInt32BE(t, 4);
        o.pc1(r, i, e.tmp, 0), r = e.tmp[0], i = e.tmp[1];
        for (var a = 0; a < e.keys.length; a += 2) {
            var s = c[a >>> 1];
            r = o.r28shl(r, s), i = o.r28shl(i, s), o.pc2(r, i, e.keys, a);
        }
    }, f.prototype._update = function(e, t, r, n) {
        var i = this._desState, a = o.readUInt32BE(e, t), s = o.readUInt32BE(e, t + 4);
        o.ip(a, s, i.tmp, 0), a = i.tmp[0], s = i.tmp[1], "encrypt" === this.type ? this._encrypt(i, a, s, i.tmp, 0) : this._decrypt(i, a, s, i.tmp, 0), 
        a = i.tmp[0], s = i.tmp[1], o.writeUInt32BE(r, a, n), o.writeUInt32BE(r, s, n + 4);
    }, f.prototype._pad = function(e, t) {
        for (var r = e.length - t, n = t; n < e.length; n++) e[n] = r;
        return !0;
    }, f.prototype._unpad = function(e) {
        for (var t = e[e.length - 1], r = e.length - t; r < e.length; r++) n.equal(e[r], t);
        return e.slice(0, e.length - t);
    }, f.prototype._encrypt = function(e, t, r, n, i) {
        for (var a = t, s = r, f = 0; f < e.keys.length; f += 2) {
            var c = e.keys[f], u = e.keys[f + 1];
            o.expand(s, e.tmp, 0), c ^= e.tmp[0], u ^= e.tmp[1];
            var d = o.substitute(c, u), h = s;
            s = (a ^ o.permute(d)) >>> 0, a = h;
        }
        o.rip(s, a, n, i);
    }, f.prototype._decrypt = function(e, t, r, n, i) {
        for (var a = r, s = t, f = e.keys.length - 2; f >= 0; f -= 2) {
            var c = e.keys[f], u = e.keys[f + 1];
            o.expand(a, e.tmp, 0), c ^= e.tmp[0], u ^= e.tmp[1];
            var d = o.substitute(c, u), h = a;
            a = (s ^ o.permute(d)) >>> 0, s = h;
        }
        o.rip(a, s, n, i);
    };
}, function(e, t, r) {
    "use strict";
    var n = r(69), i = r(17), o = {};
    function a(e) {
        n.equal(e.length, 8, "Invalid IV length"), this.iv = new Array(8);
        for (var t = 0; t < this.iv.length; t++) this.iv[t] = e[t];
    }
    t.instantiate = function(e) {
        function t(t) {
            e.call(this, t), this._cbcInit();
        }
        i(t, e);
        for (var r = Object.keys(o), n = 0; n < r.length; n++) {
            var a = r[n];
            t.prototype[a] = o[a];
        }
        return t.create = function(e) {
            return new t(e);
        }, t;
    }, o._cbcInit = function() {
        var e = new a(this.options.iv);
        this._cbcState = e;
    }, o._update = function(e, t, r, n) {
        var i = this._cbcState, o = this.constructor.super_.prototype, a = i.iv;
        if ("encrypt" === this.type) {
            for (var s = 0; s < this.blockSize; s++) a[s] ^= e[t + s];
            o._update.call(this, a, 0, r, n);
            for (s = 0; s < this.blockSize; s++) a[s] = r[n + s];
        } else {
            o._update.call(this, e, t, r, n);
            for (s = 0; s < this.blockSize; s++) r[n + s] ^= a[s];
            for (s = 0; s < this.blockSize; s++) a[s] = e[t + s];
        }
    };
}, function(e, t, r) {
    "use strict";
    var n = r(69), i = r(17), o = r(68), a = r(70);
    function s(e, t) {
        n.equal(t.length, 24, "Invalid key length");
        var r = t.slice(0, 8), i = t.slice(8, 16), o = t.slice(16, 24);
        this.ciphers = "encrypt" === e ? [ a.create({
            type: "encrypt",
            key: r
        }), a.create({
            type: "decrypt",
            key: i
        }), a.create({
            type: "encrypt",
            key: o
        }) ] : [ a.create({
            type: "decrypt",
            key: o
        }), a.create({
            type: "encrypt",
            key: i
        }), a.create({
            type: "decrypt",
            key: r
        }) ];
    }
    function f(e) {
        o.call(this, e);
        var t = new s(this.type, this.options.key);
        this._edeState = t;
    }
    i(f, o), e.exports = f, f.create = function(e) {
        return new f(e);
    }, f.prototype._update = function(e, t, r, n) {
        var i = this._edeState;
        i.ciphers[0]._update(e, t, r, n), i.ciphers[1]._update(r, n, r, n), i.ciphers[2]._update(r, n, r, n);
    }, f.prototype._pad = a.prototype._pad, f.prototype._unpad = a.prototype._unpad;
}, function(e, t, r) {
    var n = r(74), i = r(91), o = r(85);
    t.createCipher = t.Cipher = n.createCipher, t.createCipheriv = t.Cipheriv = n.createCipheriv, 
    t.createDecipher = t.Decipher = i.createDecipher, t.createDecipheriv = t.Decipheriv = i.createDecipheriv, 
    t.listCiphers = t.getCiphers = function() {
        return Object.keys(o);
    };
}, function(e, t, r) {
    var n = r(75), i = r(86), o = r(11).Buffer, a = r(89), s = r(53), f = r(87), c = r(90);
    function u(e, t, r) {
        s.call(this), this._cache = new h, this._cipher = new f.AES(t), this._prev = o.from(r), 
        this._mode = e, this._autopadding = !0;
    }
    r(17)(u, s), u.prototype._update = function(e) {
        var t, r;
        this._cache.add(e);
        for (var n = []; t = this._cache.get(); ) r = this._mode.encrypt(this, t), n.push(r);
        return o.concat(n);
    };
    var d = o.alloc(16, 16);
    function h() {
        this.cache = o.allocUnsafe(0);
    }
    function l(e, t, r) {
        var s = n[e.toLowerCase()];
        if (!s) throw new TypeError("invalid suite type");
        if ("string" == typeof t && (t = o.from(t)), t.length !== s.key / 8) throw new TypeError("invalid key length " + t.length);
        if ("string" == typeof r && (r = o.from(r)), "GCM" !== s.mode && r.length !== s.iv) throw new TypeError("invalid iv length " + r.length);
        return "stream" === s.type ? new a(s.module, t, r) : "auth" === s.type ? new i(s.module, t, r) : new u(s.module, t, r);
    }
    u.prototype._final = function() {
        var e = this._cache.flush();
        if (this._autopadding) return e = this._mode.encrypt(this, e), this._cipher.scrub(), 
        e;
        if (!e.equals(d)) throw this._cipher.scrub(), new Error("data not multiple of block length");
    }, u.prototype.setAutoPadding = function(e) {
        return this._autopadding = !!e, this;
    }, h.prototype.add = function(e) {
        this.cache = o.concat([ this.cache, e ]);
    }, h.prototype.get = function() {
        if (this.cache.length > 15) {
            var e = this.cache.slice(0, 16);
            return this.cache = this.cache.slice(16), e;
        }
        return null;
    }, h.prototype.flush = function() {
        for (var e = 16 - this.cache.length, t = o.allocUnsafe(e), r = -1; ++r < e; ) t.writeUInt8(e, r);
        return o.concat([ this.cache, t ]);
    }, t.createCipheriv = l, t.createCipher = function(e, t) {
        var r = n[e.toLowerCase()];
        if (!r) throw new TypeError("invalid suite type");
        var i = c(t, !1, r.key, r.iv);
        return l(e, i.key, i.iv);
    };
}, function(e, t, r) {
    var n = {
        ECB: r(76),
        CBC: r(77),
        CFB: r(79),
        CFB8: r(80),
        CFB1: r(81),
        OFB: r(82),
        CTR: r(83),
        GCM: r(83)
    }, i = r(85);
    for (var o in i) i[o].module = n[i[o].mode];
    e.exports = i;
}, function(e, t) {
    t.encrypt = function(e, t) {
        return e._cipher.encryptBlock(t);
    }, t.decrypt = function(e, t) {
        return e._cipher.decryptBlock(t);
    };
}, function(e, t, r) {
    var n = r(78);
    t.encrypt = function(e, t) {
        var r = n(t, e._prev);
        return e._prev = e._cipher.encryptBlock(r), e._prev;
    }, t.decrypt = function(e, t) {
        var r = e._prev;
        e._prev = t;
        var i = e._cipher.decryptBlock(t);
        return n(i, r);
    };
}, function(e, t, r) {
    (function(t) {
        e.exports = function(e, r) {
            for (var n = Math.min(e.length, r.length), i = new t(n), o = 0; o < n; ++o) i[o] = e[o] ^ r[o];
            return i;
        };
    }).call(this, r(12).Buffer);
}, function(e, t, r) {
    var n = r(11).Buffer, i = r(78);
    function o(e, t, r) {
        var o = t.length, a = i(t, e._cache);
        return e._cache = e._cache.slice(o), e._prev = n.concat([ e._prev, r ? t : a ]), 
        a;
    }
    t.encrypt = function(e, t, r) {
        for (var i, a = n.allocUnsafe(0); t.length; ) {
            if (0 === e._cache.length && (e._cache = e._cipher.encryptBlock(e._prev), e._prev = n.allocUnsafe(0)), 
            !(e._cache.length <= t.length)) {
                a = n.concat([ a, o(e, t, r) ]);
                break;
            }
            i = e._cache.length, a = n.concat([ a, o(e, t.slice(0, i), r) ]), t = t.slice(i);
        }
        return a;
    };
}, function(e, t, r) {
    var n = r(11).Buffer;
    function i(e, t, r) {
        var i = e._cipher.encryptBlock(e._prev)[0] ^ t;
        return e._prev = n.concat([ e._prev.slice(1), n.from([ r ? t : i ]) ]), i;
    }
    t.encrypt = function(e, t, r) {
        for (var o = t.length, a = n.allocUnsafe(o), s = -1; ++s < o; ) a[s] = i(e, t[s], r);
        return a;
    };
}, function(e, t, r) {
    var n = r(11).Buffer;
    function i(e, t, r) {
        for (var n, i, a = -1, s = 0; ++a < 8; ) n = t & 1 << 7 - a ? 128 : 0, s += (128 & (i = e._cipher.encryptBlock(e._prev)[0] ^ n)) >> a % 8, 
        e._prev = o(e._prev, r ? n : i);
        return s;
    }
    function o(e, t) {
        var r = e.length, i = -1, o = n.allocUnsafe(e.length);
        for (e = n.concat([ e, n.from([ t ]) ]); ++i < r; ) o[i] = e[i] << 1 | e[i + 1] >> 7;
        return o;
    }
    t.encrypt = function(e, t, r) {
        for (var o = t.length, a = n.allocUnsafe(o), s = -1; ++s < o; ) a[s] = i(e, t[s], r);
        return a;
    };
}, function(e, t, r) {
    (function(e) {
        var n = r(78);
        function i(e) {
            return e._prev = e._cipher.encryptBlock(e._prev), e._prev;
        }
        t.encrypt = function(t, r) {
            for (;t._cache.length < r.length; ) t._cache = e.concat([ t._cache, i(t) ]);
            var o = t._cache.slice(0, r.length);
            return t._cache = t._cache.slice(r.length), n(r, o);
        };
    }).call(this, r(12).Buffer);
}, function(e, t, r) {
    var n = r(78), i = r(11).Buffer, o = r(84);
    function a(e) {
        var t = e._cipher.encryptBlockRaw(e._prev);
        return o(e._prev), t;
    }
    t.encrypt = function(e, t) {
        var r = Math.ceil(t.length / 16), o = e._cache.length;
        e._cache = i.concat([ e._cache, i.allocUnsafe(16 * r) ]);
        for (var s = 0; s < r; s++) {
            var f = a(e), c = o + 16 * s;
            e._cache.writeUInt32BE(f[0], c + 0), e._cache.writeUInt32BE(f[1], c + 4), e._cache.writeUInt32BE(f[2], c + 8), 
            e._cache.writeUInt32BE(f[3], c + 12);
        }
        var u = e._cache.slice(0, t.length);
        return e._cache = e._cache.slice(t.length), n(t, u);
    };
}, function(e, t) {
    e.exports = function(e) {
        for (var t, r = e.length; r--; ) {
            if (255 !== (t = e.readUInt8(r))) {
                t++, e.writeUInt8(t, r);
                break;
            }
            e.writeUInt8(0, r);
        }
    };
}, function(e) {
    e.exports = JSON.parse('{"aes-128-ecb":{"cipher":"AES","key":128,"iv":0,"mode":"ECB","type":"block"},"aes-192-ecb":{"cipher":"AES","key":192,"iv":0,"mode":"ECB","type":"block"},"aes-256-ecb":{"cipher":"AES","key":256,"iv":0,"mode":"ECB","type":"block"},"aes-128-cbc":{"cipher":"AES","key":128,"iv":16,"mode":"CBC","type":"block"},"aes-192-cbc":{"cipher":"AES","key":192,"iv":16,"mode":"CBC","type":"block"},"aes-256-cbc":{"cipher":"AES","key":256,"iv":16,"mode":"CBC","type":"block"},"aes128":{"cipher":"AES","key":128,"iv":16,"mode":"CBC","type":"block"},"aes192":{"cipher":"AES","key":192,"iv":16,"mode":"CBC","type":"block"},"aes256":{"cipher":"AES","key":256,"iv":16,"mode":"CBC","type":"block"},"aes-128-cfb":{"cipher":"AES","key":128,"iv":16,"mode":"CFB","type":"stream"},"aes-192-cfb":{"cipher":"AES","key":192,"iv":16,"mode":"CFB","type":"stream"},"aes-256-cfb":{"cipher":"AES","key":256,"iv":16,"mode":"CFB","type":"stream"},"aes-128-cfb8":{"cipher":"AES","key":128,"iv":16,"mode":"CFB8","type":"stream"},"aes-192-cfb8":{"cipher":"AES","key":192,"iv":16,"mode":"CFB8","type":"stream"},"aes-256-cfb8":{"cipher":"AES","key":256,"iv":16,"mode":"CFB8","type":"stream"},"aes-128-cfb1":{"cipher":"AES","key":128,"iv":16,"mode":"CFB1","type":"stream"},"aes-192-cfb1":{"cipher":"AES","key":192,"iv":16,"mode":"CFB1","type":"stream"},"aes-256-cfb1":{"cipher":"AES","key":256,"iv":16,"mode":"CFB1","type":"stream"},"aes-128-ofb":{"cipher":"AES","key":128,"iv":16,"mode":"OFB","type":"stream"},"aes-192-ofb":{"cipher":"AES","key":192,"iv":16,"mode":"OFB","type":"stream"},"aes-256-ofb":{"cipher":"AES","key":256,"iv":16,"mode":"OFB","type":"stream"},"aes-128-ctr":{"cipher":"AES","key":128,"iv":16,"mode":"CTR","type":"stream"},"aes-192-ctr":{"cipher":"AES","key":192,"iv":16,"mode":"CTR","type":"stream"},"aes-256-ctr":{"cipher":"AES","key":256,"iv":16,"mode":"CTR","type":"stream"},"aes-128-gcm":{"cipher":"AES","key":128,"iv":12,"mode":"GCM","type":"auth"},"aes-192-gcm":{"cipher":"AES","key":192,"iv":12,"mode":"GCM","type":"auth"},"aes-256-gcm":{"cipher":"AES","key":256,"iv":12,"mode":"GCM","type":"auth"}}');
}, function(e, t, r) {
    var n = r(87), i = r(11).Buffer, o = r(53), a = r(17), s = r(88), f = r(78), c = r(84);
    function u(e, t, r, a) {
        o.call(this);
        var f = i.alloc(4, 0);
        this._cipher = new n.AES(t);
        var u = this._cipher.encryptBlock(f);
        this._ghash = new s(u), r = function(e, t, r) {
            if (12 === t.length) return e._finID = i.concat([ t, i.from([ 0, 0, 0, 1 ]) ]), 
            i.concat([ t, i.from([ 0, 0, 0, 2 ]) ]);
            var n = new s(r), o = t.length, a = o % 16;
            n.update(t), a && (a = 16 - a, n.update(i.alloc(a, 0))), n.update(i.alloc(8, 0));
            var f = 8 * o, u = i.alloc(8);
            u.writeUIntBE(f, 0, 8), n.update(u), e._finID = n.state;
            var d = i.from(e._finID);
            return c(d), d;
        }(this, r, u), this._prev = i.from(r), this._cache = i.allocUnsafe(0), this._secCache = i.allocUnsafe(0), 
        this._decrypt = a, this._alen = 0, this._len = 0, this._mode = e, this._authTag = null, 
        this._called = !1;
    }
    a(u, o), u.prototype._update = function(e) {
        if (!this._called && this._alen) {
            var t = 16 - this._alen % 16;
            t < 16 && (t = i.alloc(t, 0), this._ghash.update(t));
        }
        this._called = !0;
        var r = this._mode.encrypt(this, e);
        return this._decrypt ? this._ghash.update(e) : this._ghash.update(r), this._len += e.length, 
        r;
    }, u.prototype._final = function() {
        if (this._decrypt && !this._authTag) throw new Error("Unsupported state or unable to authenticate data");
        var e = f(this._ghash.final(8 * this._alen, 8 * this._len), this._cipher.encryptBlock(this._finID));
        if (this._decrypt && function(e, t) {
            var r = 0;
            e.length !== t.length && r++;
            for (var n = Math.min(e.length, t.length), i = 0; i < n; ++i) r += e[i] ^ t[i];
            return r;
        }(e, this._authTag)) throw new Error("Unsupported state or unable to authenticate data");
        this._authTag = e, this._cipher.scrub();
    }, u.prototype.getAuthTag = function() {
        if (this._decrypt || !i.isBuffer(this._authTag)) throw new Error("Attempting to get auth tag in unsupported state");
        return this._authTag;
    }, u.prototype.setAuthTag = function(e) {
        if (!this._decrypt) throw new Error("Attempting to set auth tag in unsupported state");
        this._authTag = e;
    }, u.prototype.setAAD = function(e) {
        if (this._called) throw new Error("Attempting to set AAD in unsupported state");
        this._ghash.update(e), this._alen += e.length;
    }, e.exports = u;
}, function(e, t, r) {
    var n = r(11).Buffer;
    function i(e) {
        n.isBuffer(e) || (e = n.from(e));
        for (var t = e.length / 4 | 0, r = new Array(t), i = 0; i < t; i++) r[i] = e.readUInt32BE(4 * i);
        return r;
    }
    function o(e) {
        for (;0 < e.length; e++) e[0] = 0;
    }
    function a(e, t, r, n, i) {
        for (var o, a, s, f, c = r[0], u = r[1], d = r[2], h = r[3], l = e[0] ^ t[0], p = e[1] ^ t[1], b = e[2] ^ t[2], m = e[3] ^ t[3], g = 4, y = 1; y < i; y++) o = c[l >>> 24] ^ u[p >>> 16 & 255] ^ d[b >>> 8 & 255] ^ h[255 & m] ^ t[g++], 
        a = c[p >>> 24] ^ u[b >>> 16 & 255] ^ d[m >>> 8 & 255] ^ h[255 & l] ^ t[g++], s = c[b >>> 24] ^ u[m >>> 16 & 255] ^ d[l >>> 8 & 255] ^ h[255 & p] ^ t[g++], 
        f = c[m >>> 24] ^ u[l >>> 16 & 255] ^ d[p >>> 8 & 255] ^ h[255 & b] ^ t[g++], l = o, 
        p = a, b = s, m = f;
        return o = (n[l >>> 24] << 24 | n[p >>> 16 & 255] << 16 | n[b >>> 8 & 255] << 8 | n[255 & m]) ^ t[g++], 
        a = (n[p >>> 24] << 24 | n[b >>> 16 & 255] << 16 | n[m >>> 8 & 255] << 8 | n[255 & l]) ^ t[g++], 
        s = (n[b >>> 24] << 24 | n[m >>> 16 & 255] << 16 | n[l >>> 8 & 255] << 8 | n[255 & p]) ^ t[g++], 
        f = (n[m >>> 24] << 24 | n[l >>> 16 & 255] << 16 | n[p >>> 8 & 255] << 8 | n[255 & b]) ^ t[g++], 
        [ o >>>= 0, a >>>= 0, s >>>= 0, f >>>= 0 ];
    }
    var s = [ 0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54 ], f = function() {
        for (var e = new Array(256), t = 0; t < 256; t++) e[t] = t < 128 ? t << 1 : t << 1 ^ 283;
        for (var r = [], n = [], i = [ [], [], [], [] ], o = [ [], [], [], [] ], a = 0, s = 0, f = 0; f < 256; ++f) {
            var c = s ^ s << 1 ^ s << 2 ^ s << 3 ^ s << 4;
            c = c >>> 8 ^ 255 & c ^ 99, r[a] = c, n[c] = a;
            var u = e[a], d = e[u], h = e[d], l = 257 * e[c] ^ 16843008 * c;
            i[0][a] = l << 24 | l >>> 8, i[1][a] = l << 16 | l >>> 16, i[2][a] = l << 8 | l >>> 24, 
            i[3][a] = l, l = 16843009 * h ^ 65537 * d ^ 257 * u ^ 16843008 * a, o[0][c] = l << 24 | l >>> 8, 
            o[1][c] = l << 16 | l >>> 16, o[2][c] = l << 8 | l >>> 24, o[3][c] = l, 0 === a ? a = s = 1 : (a = u ^ e[e[e[h ^ u]]], 
            s ^= e[e[s]]);
        }
        return {
            SBOX: r,
            INV_SBOX: n,
            SUB_MIX: i,
            INV_SUB_MIX: o
        };
    }();
    function c(e) {
        this._key = i(e), this._reset();
    }
    c.blockSize = 16, c.keySize = 32, c.prototype.blockSize = c.blockSize, c.prototype.keySize = c.keySize, 
    c.prototype._reset = function() {
        for (var e = this._key, t = e.length, r = t + 6, n = 4 * (r + 1), i = [], o = 0; o < t; o++) i[o] = e[o];
        for (o = t; o < n; o++) {
            var a = i[o - 1];
            o % t == 0 ? (a = a << 8 | a >>> 24, a = f.SBOX[a >>> 24] << 24 | f.SBOX[a >>> 16 & 255] << 16 | f.SBOX[a >>> 8 & 255] << 8 | f.SBOX[255 & a], 
            a ^= s[o / t | 0] << 24) : t > 6 && o % t == 4 && (a = f.SBOX[a >>> 24] << 24 | f.SBOX[a >>> 16 & 255] << 16 | f.SBOX[a >>> 8 & 255] << 8 | f.SBOX[255 & a]), 
            i[o] = i[o - t] ^ a;
        }
        for (var c = [], u = 0; u < n; u++) {
            var d = n - u, h = i[d - (u % 4 ? 0 : 4)];
            c[u] = u < 4 || d <= 4 ? h : f.INV_SUB_MIX[0][f.SBOX[h >>> 24]] ^ f.INV_SUB_MIX[1][f.SBOX[h >>> 16 & 255]] ^ f.INV_SUB_MIX[2][f.SBOX[h >>> 8 & 255]] ^ f.INV_SUB_MIX[3][f.SBOX[255 & h]];
        }
        this._nRounds = r, this._keySchedule = i, this._invKeySchedule = c;
    }, c.prototype.encryptBlockRaw = function(e) {
        return a(e = i(e), this._keySchedule, f.SUB_MIX, f.SBOX, this._nRounds);
    }, c.prototype.encryptBlock = function(e) {
        var t = this.encryptBlockRaw(e), r = n.allocUnsafe(16);
        return r.writeUInt32BE(t[0], 0), r.writeUInt32BE(t[1], 4), r.writeUInt32BE(t[2], 8), 
        r.writeUInt32BE(t[3], 12), r;
    }, c.prototype.decryptBlock = function(e) {
        var t = (e = i(e))[1];
        e[1] = e[3], e[3] = t;
        var r = a(e, this._invKeySchedule, f.INV_SUB_MIX, f.INV_SBOX, this._nRounds), o = n.allocUnsafe(16);
        return o.writeUInt32BE(r[0], 0), o.writeUInt32BE(r[3], 4), o.writeUInt32BE(r[2], 8), 
        o.writeUInt32BE(r[1], 12), o;
    }, c.prototype.scrub = function() {
        o(this._keySchedule), o(this._invKeySchedule), o(this._key);
    }, e.exports.AES = c;
}, function(e, t, r) {
    var n = r(11).Buffer, i = n.alloc(16, 0);
    function o(e) {
        var t = n.allocUnsafe(16);
        return t.writeUInt32BE(e[0] >>> 0, 0), t.writeUInt32BE(e[1] >>> 0, 4), t.writeUInt32BE(e[2] >>> 0, 8), 
        t.writeUInt32BE(e[3] >>> 0, 12), t;
    }
    function a(e) {
        this.h = e, this.state = n.alloc(16, 0), this.cache = n.allocUnsafe(0);
    }
    a.prototype.ghash = function(e) {
        for (var t = -1; ++t < e.length; ) this.state[t] ^= e[t];
        this._multiply();
    }, a.prototype._multiply = function() {
        for (var e, t, r, n = [ (e = this.h).readUInt32BE(0), e.readUInt32BE(4), e.readUInt32BE(8), e.readUInt32BE(12) ], i = [ 0, 0, 0, 0 ], a = -1; ++a < 128; ) {
            for (0 != (this.state[~~(a / 8)] & 1 << 7 - a % 8) && (i[0] ^= n[0], i[1] ^= n[1], 
            i[2] ^= n[2], i[3] ^= n[3]), r = 0 != (1 & n[3]), t = 3; t > 0; t--) n[t] = n[t] >>> 1 | (1 & n[t - 1]) << 31;
            n[0] = n[0] >>> 1, r && (n[0] = n[0] ^ 225 << 24);
        }
        this.state = o(i);
    }, a.prototype.update = function(e) {
        var t;
        for (this.cache = n.concat([ this.cache, e ]); this.cache.length >= 16; ) t = this.cache.slice(0, 16), 
        this.cache = this.cache.slice(16), this.ghash(t);
    }, a.prototype.final = function(e, t) {
        return this.cache.length && this.ghash(n.concat([ this.cache, i ], 16)), this.ghash(o([ 0, e, 0, t ])), 
        this.state;
    }, e.exports = a;
}, function(e, t, r) {
    var n = r(87), i = r(11).Buffer, o = r(53);
    function a(e, t, r, a) {
        o.call(this), this._cipher = new n.AES(t), this._prev = i.from(r), this._cache = i.allocUnsafe(0), 
        this._secCache = i.allocUnsafe(0), this._decrypt = a, this._mode = e;
    }
    r(17)(a, o), a.prototype._update = function(e) {
        return this._mode.encrypt(this, e, this._decrypt);
    }, a.prototype._final = function() {
        this._cipher.scrub();
    }, e.exports = a;
}, function(e, t, r) {
    var n = r(11).Buffer, i = r(18);
    e.exports = function(e, t, r, o) {
        if (n.isBuffer(e) || (e = n.from(e, "binary")), t && (n.isBuffer(t) || (t = n.from(t, "binary")), 
        8 !== t.length)) throw new RangeError("salt should be Buffer with 8 byte length");
        for (var a = r / 8, s = n.alloc(a), f = n.alloc(o || 0), c = n.alloc(0); a > 0 || o > 0; ) {
            var u = new i;
            u.update(c), u.update(e), t && u.update(t), c = u.digest();
            var d = 0;
            if (a > 0) {
                var h = s.length - a;
                d = Math.min(a, c.length), c.copy(s, h, 0, d), a -= d;
            }
            if (d < c.length && o > 0) {
                var l = f.length - o, p = Math.min(o, c.length - d);
                c.copy(f, l, d, d + p), o -= p;
            }
        }
        return c.fill(0), {
            key: s,
            iv: f
        };
    };
}, function(e, t, r) {
    var n = r(86), i = r(11).Buffer, o = r(75), a = r(89), s = r(53), f = r(87), c = r(90);
    function u(e, t, r) {
        s.call(this), this._cache = new d, this._last = void 0, this._cipher = new f.AES(t), 
        this._prev = i.from(r), this._mode = e, this._autopadding = !0;
    }
    function d() {
        this.cache = i.allocUnsafe(0);
    }
    function h(e, t, r) {
        var s = o[e.toLowerCase()];
        if (!s) throw new TypeError("invalid suite type");
        if ("string" == typeof r && (r = i.from(r)), "GCM" !== s.mode && r.length !== s.iv) throw new TypeError("invalid iv length " + r.length);
        if ("string" == typeof t && (t = i.from(t)), t.length !== s.key / 8) throw new TypeError("invalid key length " + t.length);
        return "stream" === s.type ? new a(s.module, t, r, !0) : "auth" === s.type ? new n(s.module, t, r, !0) : new u(s.module, t, r);
    }
    r(17)(u, s), u.prototype._update = function(e) {
        var t, r;
        this._cache.add(e);
        for (var n = []; t = this._cache.get(this._autopadding); ) r = this._mode.decrypt(this, t), 
        n.push(r);
        return i.concat(n);
    }, u.prototype._final = function() {
        var e = this._cache.flush();
        if (this._autopadding) return function(e) {
            var t = e[15];
            if (t < 1 || t > 16) throw new Error("unable to decrypt data");
            var r = -1;
            for (;++r < t; ) if (e[r + (16 - t)] !== t) throw new Error("unable to decrypt data");
            if (16 === t) return;
            return e.slice(0, 16 - t);
        }(this._mode.decrypt(this, e));
        if (e) throw new Error("data not multiple of block length");
    }, u.prototype.setAutoPadding = function(e) {
        return this._autopadding = !!e, this;
    }, d.prototype.add = function(e) {
        this.cache = i.concat([ this.cache, e ]);
    }, d.prototype.get = function(e) {
        var t;
        if (e) {
            if (this.cache.length > 16) return t = this.cache.slice(0, 16), this.cache = this.cache.slice(16), 
            t;
        } else if (this.cache.length >= 16) return t = this.cache.slice(0, 16), this.cache = this.cache.slice(16), 
        t;
        return null;
    }, d.prototype.flush = function() {
        if (this.cache.length) return this.cache;
    }, t.createDecipher = function(e, t) {
        var r = o[e.toLowerCase()];
        if (!r) throw new TypeError("invalid suite type");
        var n = c(t, !1, r.key, r.iv);
        return h(e, n.key, n.iv);
    }, t.createDecipheriv = h;
}, function(e, t) {
    t["des-ecb"] = {
        key: 8,
        iv: 0
    }, t["des-cbc"] = t.des = {
        key: 8,
        iv: 8
    }, t["des-ede3-cbc"] = t.des3 = {
        key: 24,
        iv: 8
    }, t["des-ede3"] = {
        key: 24,
        iv: 0
    }, t["des-ede-cbc"] = {
        key: 16,
        iv: 8
    }, t["des-ede"] = {
        key: 16,
        iv: 0
    };
}, function(e, t, r) {
    (function(e) {
        var n = r(94), i = r(101), o = r(102);
        var a = {
            binary: !0,
            hex: !0,
            base64: !0
        };
        t.DiffieHellmanGroup = t.createDiffieHellmanGroup = t.getDiffieHellman = function(t) {
            var r = new e(i[t].prime, "hex"), n = new e(i[t].gen, "hex");
            return new o(r, n);
        }, t.createDiffieHellman = t.DiffieHellman = function t(r, i, s, f) {
            return e.isBuffer(i) || void 0 === a[i] ? t(r, "binary", i, s) : (i = i || "binary", 
            f = f || "binary", s = s || new e([ 2 ]), e.isBuffer(s) || (s = new e(s, f)), "number" == typeof r ? new o(n(r, s), s, !0) : (e.isBuffer(r) || (r = new e(r, i)), 
            new o(r, s, !0)));
        };
    }).call(this, r(12).Buffer);
}, function(e, t, r) {
    var n = r(9);
    e.exports = y, y.simpleSieve = m, y.fermatTest = g;
    var i = r(95), o = new i(24), a = new (r(98)), s = new i(1), f = new i(2), c = new i(5), u = (new i(16), 
    new i(8), new i(10)), d = new i(3), h = (new i(7), new i(11)), l = new i(4), p = (new i(12), 
    null);
    function b() {
        if (null !== p) return p;
        var e = [];
        e[0] = 2;
        for (var t = 1, r = 3; r < 1048576; r += 2) {
            for (var n = Math.ceil(Math.sqrt(r)), i = 0; i < t && e[i] <= n && r % e[i] != 0; i++) ;
            t !== i && e[i] <= n || (e[t++] = r);
        }
        return p = e, e;
    }
    function m(e) {
        for (var t = b(), r = 0; r < t.length; r++) if (0 === e.modn(t[r])) return 0 === e.cmpn(t[r]);
        return !0;
    }
    function g(e) {
        var t = i.mont(e);
        return 0 === f.toRed(t).redPow(e.subn(1)).fromRed().cmpn(1);
    }
    function y(e, t) {
        if (e < 16) return new i(2 === t || 5 === t ? [ 140, 123 ] : [ 140, 39 ]);
        var r, p;
        for (t = new i(t); ;) {
            for (r = new i(n(Math.ceil(e / 8))); r.bitLength() > e; ) r.ishrn(1);
            if (r.isEven() && r.iadd(s), r.testn(1) || r.iadd(f), t.cmp(f)) {
                if (!t.cmp(c)) for (;r.mod(u).cmp(d); ) r.iadd(l);
            } else for (;r.mod(o).cmp(h); ) r.iadd(l);
            if (m(p = r.shrn(1)) && m(r) && g(p) && g(r) && a.test(p) && a.test(r)) return r;
        }
    }
}, function(e, t, r) {
    (function(e) {
        !function(e, t) {
            "use strict";
            function n(e, t) {
                if (!e) throw new Error(t || "Assertion failed");
            }
            function i(e, t) {
                e.super_ = t;
                var r = function() {};
                r.prototype = t.prototype, e.prototype = new r, e.prototype.constructor = e;
            }
            function o(e, t, r) {
                if (o.isBN(e)) return e;
                this.negative = 0, this.words = null, this.length = 0, this.red = null, null !== e && ("le" !== t && "be" !== t || (r = t, 
                t = 10), this._init(e || 0, t || 10, r || "be"));
            }
            var a;
            "object" == typeof e ? e.exports = o : t.BN = o, o.BN = o, o.wordSize = 26;
            try {
                a = r(97).Buffer;
            } catch (e) {}
            function s(e, t, r) {
                for (var n = 0, i = Math.min(e.length, r), o = t; o < i; o++) {
                    var a = e.charCodeAt(o) - 48;
                    n <<= 4, n |= a >= 49 && a <= 54 ? a - 49 + 10 : a >= 17 && a <= 22 ? a - 17 + 10 : 15 & a;
                }
                return n;
            }
            function f(e, t, r, n) {
                for (var i = 0, o = Math.min(e.length, r), a = t; a < o; a++) {
                    var s = e.charCodeAt(a) - 48;
                    i *= n, i += s >= 49 ? s - 49 + 10 : s >= 17 ? s - 17 + 10 : s;
                }
                return i;
            }
            o.isBN = function(e) {
                return e instanceof o || null !== e && "object" == typeof e && e.constructor.wordSize === o.wordSize && Array.isArray(e.words);
            }, o.max = function(e, t) {
                return e.cmp(t) > 0 ? e : t;
            }, o.min = function(e, t) {
                return e.cmp(t) < 0 ? e : t;
            }, o.prototype._init = function(e, t, r) {
                if ("number" == typeof e) return this._initNumber(e, t, r);
                if ("object" == typeof e) return this._initArray(e, t, r);
                "hex" === t && (t = 16), n(t === (0 | t) && t >= 2 && t <= 36);
                var i = 0;
                "-" === (e = e.toString().replace(/\s+/g, ""))[0] && i++, 16 === t ? this._parseHex(e, i) : this._parseBase(e, t, i), 
                "-" === e[0] && (this.negative = 1), this.strip(), "le" === r && this._initArray(this.toArray(), t, r);
            }, o.prototype._initNumber = function(e, t, r) {
                e < 0 && (this.negative = 1, e = -e), e < 67108864 ? (this.words = [ 67108863 & e ], 
                this.length = 1) : e < 4503599627370496 ? (this.words = [ 67108863 & e, e / 67108864 & 67108863 ], 
                this.length = 2) : (n(e < 9007199254740992), this.words = [ 67108863 & e, e / 67108864 & 67108863, 1 ], 
                this.length = 3), "le" === r && this._initArray(this.toArray(), t, r);
            }, o.prototype._initArray = function(e, t, r) {
                if (n("number" == typeof e.length), e.length <= 0) return this.words = [ 0 ], this.length = 1, 
                this;
                this.length = Math.ceil(e.length / 3), this.words = new Array(this.length);
                for (var i = 0; i < this.length; i++) this.words[i] = 0;
                var o, a, s = 0;
                if ("be" === r) for (i = e.length - 1, o = 0; i >= 0; i -= 3) a = e[i] | e[i - 1] << 8 | e[i - 2] << 16, 
                this.words[o] |= a << s & 67108863, this.words[o + 1] = a >>> 26 - s & 67108863, 
                (s += 24) >= 26 && (s -= 26, o++); else if ("le" === r) for (i = 0, o = 0; i < e.length; i += 3) a = e[i] | e[i + 1] << 8 | e[i + 2] << 16, 
                this.words[o] |= a << s & 67108863, this.words[o + 1] = a >>> 26 - s & 67108863, 
                (s += 24) >= 26 && (s -= 26, o++);
                return this.strip();
            }, o.prototype._parseHex = function(e, t) {
                this.length = Math.ceil((e.length - t) / 6), this.words = new Array(this.length);
                for (var r = 0; r < this.length; r++) this.words[r] = 0;
                var n, i, o = 0;
                for (r = e.length - 6, n = 0; r >= t; r -= 6) i = s(e, r, r + 6), this.words[n] |= i << o & 67108863, 
                this.words[n + 1] |= i >>> 26 - o & 4194303, (o += 24) >= 26 && (o -= 26, n++);
                r + 6 !== t && (i = s(e, t, r + 6), this.words[n] |= i << o & 67108863, this.words[n + 1] |= i >>> 26 - o & 4194303), 
                this.strip();
            }, o.prototype._parseBase = function(e, t, r) {
                this.words = [ 0 ], this.length = 1;
                for (var n = 0, i = 1; i <= 67108863; i *= t) n++;
                n--, i = i / t | 0;
                for (var o = e.length - r, a = o % n, s = Math.min(o, o - a) + r, c = 0, u = r; u < s; u += n) c = f(e, u, u + n, t), 
                this.imuln(i), this.words[0] + c < 67108864 ? this.words[0] += c : this._iaddn(c);
                if (0 !== a) {
                    var d = 1;
                    for (c = f(e, u, e.length, t), u = 0; u < a; u++) d *= t;
                    this.imuln(d), this.words[0] + c < 67108864 ? this.words[0] += c : this._iaddn(c);
                }
            }, o.prototype.copy = function(e) {
                e.words = new Array(this.length);
                for (var t = 0; t < this.length; t++) e.words[t] = this.words[t];
                e.length = this.length, e.negative = this.negative, e.red = this.red;
            }, o.prototype.clone = function() {
                var e = new o(null);
                return this.copy(e), e;
            }, o.prototype._expand = function(e) {
                for (;this.length < e; ) this.words[this.length++] = 0;
                return this;
            }, o.prototype.strip = function() {
                for (;this.length > 1 && 0 === this.words[this.length - 1]; ) this.length--;
                return this._normSign();
            }, o.prototype._normSign = function() {
                return 1 === this.length && 0 === this.words[0] && (this.negative = 0), this;
            }, o.prototype.inspect = function() {
                return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
            };
            var c = [ "", "0", "00", "000", "0000", "00000", "000000", "0000000", "00000000", "000000000", "0000000000", "00000000000", "000000000000", "0000000000000", "00000000000000", "000000000000000", "0000000000000000", "00000000000000000", "000000000000000000", "0000000000000000000", "00000000000000000000", "000000000000000000000", "0000000000000000000000", "00000000000000000000000", "000000000000000000000000", "0000000000000000000000000" ], u = [ 0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5 ], d = [ 0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176 ];
            function h(e, t, r) {
                r.negative = t.negative ^ e.negative;
                var n = e.length + t.length | 0;
                r.length = n, n = n - 1 | 0;
                var i = 0 | e.words[0], o = 0 | t.words[0], a = i * o, s = 67108863 & a, f = a / 67108864 | 0;
                r.words[0] = s;
                for (var c = 1; c < n; c++) {
                    for (var u = f >>> 26, d = 67108863 & f, h = Math.min(c, t.length - 1), l = Math.max(0, c - e.length + 1); l <= h; l++) {
                        var p = c - l | 0;
                        u += (a = (i = 0 | e.words[p]) * (o = 0 | t.words[l]) + d) / 67108864 | 0, d = 67108863 & a;
                    }
                    r.words[c] = 0 | d, f = 0 | u;
                }
                return 0 !== f ? r.words[c] = 0 | f : r.length--, r.strip();
            }
            o.prototype.toString = function(e, t) {
                var r;
                if (t = 0 | t || 1, 16 === (e = e || 10) || "hex" === e) {
                    r = "";
                    for (var i = 0, o = 0, a = 0; a < this.length; a++) {
                        var s = this.words[a], f = (16777215 & (s << i | o)).toString(16);
                        r = 0 !== (o = s >>> 24 - i & 16777215) || a !== this.length - 1 ? c[6 - f.length] + f + r : f + r, 
                        (i += 2) >= 26 && (i -= 26, a--);
                    }
                    for (0 !== o && (r = o.toString(16) + r); r.length % t != 0; ) r = "0" + r;
                    return 0 !== this.negative && (r = "-" + r), r;
                }
                if (e === (0 | e) && e >= 2 && e <= 36) {
                    var h = u[e], l = d[e];
                    r = "";
                    var p = this.clone();
                    for (p.negative = 0; !p.isZero(); ) {
                        var b = p.modn(l).toString(e);
                        r = (p = p.idivn(l)).isZero() ? b + r : c[h - b.length] + b + r;
                    }
                    for (this.isZero() && (r = "0" + r); r.length % t != 0; ) r = "0" + r;
                    return 0 !== this.negative && (r = "-" + r), r;
                }
                n(!1, "Base should be between 2 and 36");
            }, o.prototype.toNumber = function() {
                var e = this.words[0];
                return 2 === this.length ? e += 67108864 * this.words[1] : 3 === this.length && 1 === this.words[2] ? e += 4503599627370496 + 67108864 * this.words[1] : this.length > 2 && n(!1, "Number can only safely store up to 53 bits"), 
                0 !== this.negative ? -e : e;
            }, o.prototype.toJSON = function() {
                return this.toString(16);
            }, o.prototype.toBuffer = function(e, t) {
                return n(void 0 !== a), this.toArrayLike(a, e, t);
            }, o.prototype.toArray = function(e, t) {
                return this.toArrayLike(Array, e, t);
            }, o.prototype.toArrayLike = function(e, t, r) {
                var i = this.byteLength(), o = r || Math.max(1, i);
                n(i <= o, "byte array longer than desired length"), n(o > 0, "Requested array length <= 0"), 
                this.strip();
                var a, s, f = "le" === t, c = new e(o), u = this.clone();
                if (f) {
                    for (s = 0; !u.isZero(); s++) a = u.andln(255), u.iushrn(8), c[s] = a;
                    for (;s < o; s++) c[s] = 0;
                } else {
                    for (s = 0; s < o - i; s++) c[s] = 0;
                    for (s = 0; !u.isZero(); s++) a = u.andln(255), u.iushrn(8), c[o - s - 1] = a;
                }
                return c;
            }, Math.clz32 ? o.prototype._countBits = function(e) {
                return 32 - Math.clz32(e);
            } : o.prototype._countBits = function(e) {
                var t = e, r = 0;
                return t >= 4096 && (r += 13, t >>>= 13), t >= 64 && (r += 7, t >>>= 7), t >= 8 && (r += 4, 
                t >>>= 4), t >= 2 && (r += 2, t >>>= 2), r + t;
            }, o.prototype._zeroBits = function(e) {
                if (0 === e) return 26;
                var t = e, r = 0;
                return 0 == (8191 & t) && (r += 13, t >>>= 13), 0 == (127 & t) && (r += 7, t >>>= 7), 
                0 == (15 & t) && (r += 4, t >>>= 4), 0 == (3 & t) && (r += 2, t >>>= 2), 0 == (1 & t) && r++, 
                r;
            }, o.prototype.bitLength = function() {
                var e = this.words[this.length - 1], t = this._countBits(e);
                return 26 * (this.length - 1) + t;
            }, o.prototype.zeroBits = function() {
                if (this.isZero()) return 0;
                for (var e = 0, t = 0; t < this.length; t++) {
                    var r = this._zeroBits(this.words[t]);
                    if (e += r, 26 !== r) break;
                }
                return e;
            }, o.prototype.byteLength = function() {
                return Math.ceil(this.bitLength() / 8);
            }, o.prototype.toTwos = function(e) {
                return 0 !== this.negative ? this.abs().inotn(e).iaddn(1) : this.clone();
            }, o.prototype.fromTwos = function(e) {
                return this.testn(e - 1) ? this.notn(e).iaddn(1).ineg() : this.clone();
            }, o.prototype.isNeg = function() {
                return 0 !== this.negative;
            }, o.prototype.neg = function() {
                return this.clone().ineg();
            }, o.prototype.ineg = function() {
                return this.isZero() || (this.negative ^= 1), this;
            }, o.prototype.iuor = function(e) {
                for (;this.length < e.length; ) this.words[this.length++] = 0;
                for (var t = 0; t < e.length; t++) this.words[t] = this.words[t] | e.words[t];
                return this.strip();
            }, o.prototype.ior = function(e) {
                return n(0 == (this.negative | e.negative)), this.iuor(e);
            }, o.prototype.or = function(e) {
                return this.length > e.length ? this.clone().ior(e) : e.clone().ior(this);
            }, o.prototype.uor = function(e) {
                return this.length > e.length ? this.clone().iuor(e) : e.clone().iuor(this);
            }, o.prototype.iuand = function(e) {
                var t;
                t = this.length > e.length ? e : this;
                for (var r = 0; r < t.length; r++) this.words[r] = this.words[r] & e.words[r];
                return this.length = t.length, this.strip();
            }, o.prototype.iand = function(e) {
                return n(0 == (this.negative | e.negative)), this.iuand(e);
            }, o.prototype.and = function(e) {
                return this.length > e.length ? this.clone().iand(e) : e.clone().iand(this);
            }, o.prototype.uand = function(e) {
                return this.length > e.length ? this.clone().iuand(e) : e.clone().iuand(this);
            }, o.prototype.iuxor = function(e) {
                var t, r;
                this.length > e.length ? (t = this, r = e) : (t = e, r = this);
                for (var n = 0; n < r.length; n++) this.words[n] = t.words[n] ^ r.words[n];
                if (this !== t) for (;n < t.length; n++) this.words[n] = t.words[n];
                return this.length = t.length, this.strip();
            }, o.prototype.ixor = function(e) {
                return n(0 == (this.negative | e.negative)), this.iuxor(e);
            }, o.prototype.xor = function(e) {
                return this.length > e.length ? this.clone().ixor(e) : e.clone().ixor(this);
            }, o.prototype.uxor = function(e) {
                return this.length > e.length ? this.clone().iuxor(e) : e.clone().iuxor(this);
            }, o.prototype.inotn = function(e) {
                n("number" == typeof e && e >= 0);
                var t = 0 | Math.ceil(e / 26), r = e % 26;
                this._expand(t), r > 0 && t--;
                for (var i = 0; i < t; i++) this.words[i] = 67108863 & ~this.words[i];
                return r > 0 && (this.words[i] = ~this.words[i] & 67108863 >> 26 - r), this.strip();
            }, o.prototype.notn = function(e) {
                return this.clone().inotn(e);
            }, o.prototype.setn = function(e, t) {
                n("number" == typeof e && e >= 0);
                var r = e / 26 | 0, i = e % 26;
                return this._expand(r + 1), this.words[r] = t ? this.words[r] | 1 << i : this.words[r] & ~(1 << i), 
                this.strip();
            }, o.prototype.iadd = function(e) {
                var t, r, n;
                if (0 !== this.negative && 0 === e.negative) return this.negative = 0, t = this.isub(e), 
                this.negative ^= 1, this._normSign();
                if (0 === this.negative && 0 !== e.negative) return e.negative = 0, t = this.isub(e), 
                e.negative = 1, t._normSign();
                this.length > e.length ? (r = this, n = e) : (r = e, n = this);
                for (var i = 0, o = 0; o < n.length; o++) t = (0 | r.words[o]) + (0 | n.words[o]) + i, 
                this.words[o] = 67108863 & t, i = t >>> 26;
                for (;0 !== i && o < r.length; o++) t = (0 | r.words[o]) + i, this.words[o] = 67108863 & t, 
                i = t >>> 26;
                if (this.length = r.length, 0 !== i) this.words[this.length] = i, this.length++; else if (r !== this) for (;o < r.length; o++) this.words[o] = r.words[o];
                return this;
            }, o.prototype.add = function(e) {
                var t;
                return 0 !== e.negative && 0 === this.negative ? (e.negative = 0, t = this.sub(e), 
                e.negative ^= 1, t) : 0 === e.negative && 0 !== this.negative ? (this.negative = 0, 
                t = e.sub(this), this.negative = 1, t) : this.length > e.length ? this.clone().iadd(e) : e.clone().iadd(this);
            }, o.prototype.isub = function(e) {
                if (0 !== e.negative) {
                    e.negative = 0;
                    var t = this.iadd(e);
                    return e.negative = 1, t._normSign();
                }
                if (0 !== this.negative) return this.negative = 0, this.iadd(e), this.negative = 1, 
                this._normSign();
                var r, n, i = this.cmp(e);
                if (0 === i) return this.negative = 0, this.length = 1, this.words[0] = 0, this;
                i > 0 ? (r = this, n = e) : (r = e, n = this);
                for (var o = 0, a = 0; a < n.length; a++) o = (t = (0 | r.words[a]) - (0 | n.words[a]) + o) >> 26, 
                this.words[a] = 67108863 & t;
                for (;0 !== o && a < r.length; a++) o = (t = (0 | r.words[a]) + o) >> 26, this.words[a] = 67108863 & t;
                if (0 === o && a < r.length && r !== this) for (;a < r.length; a++) this.words[a] = r.words[a];
                return this.length = Math.max(this.length, a), r !== this && (this.negative = 1), 
                this.strip();
            }, o.prototype.sub = function(e) {
                return this.clone().isub(e);
            };
            var l = function(e, t, r) {
                var n, i, o, a = e.words, s = t.words, f = r.words, c = 0, u = 0 | a[0], d = 8191 & u, h = u >>> 13, l = 0 | a[1], p = 8191 & l, b = l >>> 13, m = 0 | a[2], g = 8191 & m, y = m >>> 13, v = 0 | a[3], w = 8191 & v, _ = v >>> 13, x = 0 | a[4], S = 8191 & x, A = x >>> 13, E = 0 | a[5], M = 8191 & E, k = E >>> 13, C = 0 | a[6], T = 8191 & C, I = C >>> 13, B = 0 | a[7], j = 8191 & B, R = B >>> 13, D = 0 | a[8], P = 8191 & D, q = D >>> 13, N = 0 | a[9], O = 8191 & N, L = N >>> 13, U = 0 | s[0], z = 8191 & U, H = U >>> 13, F = 0 | s[1], W = 8191 & F, K = F >>> 13, Y = 0 | s[2], V = 8191 & Y, J = Y >>> 13, G = 0 | s[3], X = 8191 & G, $ = G >>> 13, Z = 0 | s[4], Q = 8191 & Z, ee = Z >>> 13, te = 0 | s[5], re = 8191 & te, ne = te >>> 13, ie = 0 | s[6], oe = 8191 & ie, ae = ie >>> 13, se = 0 | s[7], fe = 8191 & se, ce = se >>> 13, ue = 0 | s[8], de = 8191 & ue, he = ue >>> 13, le = 0 | s[9], pe = 8191 & le, be = le >>> 13;
                r.negative = e.negative ^ t.negative, r.length = 19;
                var me = (c + (n = Math.imul(d, z)) | 0) + ((8191 & (i = (i = Math.imul(d, H)) + Math.imul(h, z) | 0)) << 13) | 0;
                c = ((o = Math.imul(h, H)) + (i >>> 13) | 0) + (me >>> 26) | 0, me &= 67108863, 
                n = Math.imul(p, z), i = (i = Math.imul(p, H)) + Math.imul(b, z) | 0, o = Math.imul(b, H);
                var ge = (c + (n = n + Math.imul(d, W) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(d, K) | 0) + Math.imul(h, W) | 0)) << 13) | 0;
                c = ((o = o + Math.imul(h, K) | 0) + (i >>> 13) | 0) + (ge >>> 26) | 0, ge &= 67108863, 
                n = Math.imul(g, z), i = (i = Math.imul(g, H)) + Math.imul(y, z) | 0, o = Math.imul(y, H), 
                n = n + Math.imul(p, W) | 0, i = (i = i + Math.imul(p, K) | 0) + Math.imul(b, W) | 0, 
                o = o + Math.imul(b, K) | 0;
                var ye = (c + (n = n + Math.imul(d, V) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(d, J) | 0) + Math.imul(h, V) | 0)) << 13) | 0;
                c = ((o = o + Math.imul(h, J) | 0) + (i >>> 13) | 0) + (ye >>> 26) | 0, ye &= 67108863, 
                n = Math.imul(w, z), i = (i = Math.imul(w, H)) + Math.imul(_, z) | 0, o = Math.imul(_, H), 
                n = n + Math.imul(g, W) | 0, i = (i = i + Math.imul(g, K) | 0) + Math.imul(y, W) | 0, 
                o = o + Math.imul(y, K) | 0, n = n + Math.imul(p, V) | 0, i = (i = i + Math.imul(p, J) | 0) + Math.imul(b, V) | 0, 
                o = o + Math.imul(b, J) | 0;
                var ve = (c + (n = n + Math.imul(d, X) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(d, $) | 0) + Math.imul(h, X) | 0)) << 13) | 0;
                c = ((o = o + Math.imul(h, $) | 0) + (i >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, 
                n = Math.imul(S, z), i = (i = Math.imul(S, H)) + Math.imul(A, z) | 0, o = Math.imul(A, H), 
                n = n + Math.imul(w, W) | 0, i = (i = i + Math.imul(w, K) | 0) + Math.imul(_, W) | 0, 
                o = o + Math.imul(_, K) | 0, n = n + Math.imul(g, V) | 0, i = (i = i + Math.imul(g, J) | 0) + Math.imul(y, V) | 0, 
                o = o + Math.imul(y, J) | 0, n = n + Math.imul(p, X) | 0, i = (i = i + Math.imul(p, $) | 0) + Math.imul(b, X) | 0, 
                o = o + Math.imul(b, $) | 0;
                var we = (c + (n = n + Math.imul(d, Q) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(d, ee) | 0) + Math.imul(h, Q) | 0)) << 13) | 0;
                c = ((o = o + Math.imul(h, ee) | 0) + (i >>> 13) | 0) + (we >>> 26) | 0, we &= 67108863, 
                n = Math.imul(M, z), i = (i = Math.imul(M, H)) + Math.imul(k, z) | 0, o = Math.imul(k, H), 
                n = n + Math.imul(S, W) | 0, i = (i = i + Math.imul(S, K) | 0) + Math.imul(A, W) | 0, 
                o = o + Math.imul(A, K) | 0, n = n + Math.imul(w, V) | 0, i = (i = i + Math.imul(w, J) | 0) + Math.imul(_, V) | 0, 
                o = o + Math.imul(_, J) | 0, n = n + Math.imul(g, X) | 0, i = (i = i + Math.imul(g, $) | 0) + Math.imul(y, X) | 0, 
                o = o + Math.imul(y, $) | 0, n = n + Math.imul(p, Q) | 0, i = (i = i + Math.imul(p, ee) | 0) + Math.imul(b, Q) | 0, 
                o = o + Math.imul(b, ee) | 0;
                var _e = (c + (n = n + Math.imul(d, re) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(d, ne) | 0) + Math.imul(h, re) | 0)) << 13) | 0;
                c = ((o = o + Math.imul(h, ne) | 0) + (i >>> 13) | 0) + (_e >>> 26) | 0, _e &= 67108863, 
                n = Math.imul(T, z), i = (i = Math.imul(T, H)) + Math.imul(I, z) | 0, o = Math.imul(I, H), 
                n = n + Math.imul(M, W) | 0, i = (i = i + Math.imul(M, K) | 0) + Math.imul(k, W) | 0, 
                o = o + Math.imul(k, K) | 0, n = n + Math.imul(S, V) | 0, i = (i = i + Math.imul(S, J) | 0) + Math.imul(A, V) | 0, 
                o = o + Math.imul(A, J) | 0, n = n + Math.imul(w, X) | 0, i = (i = i + Math.imul(w, $) | 0) + Math.imul(_, X) | 0, 
                o = o + Math.imul(_, $) | 0, n = n + Math.imul(g, Q) | 0, i = (i = i + Math.imul(g, ee) | 0) + Math.imul(y, Q) | 0, 
                o = o + Math.imul(y, ee) | 0, n = n + Math.imul(p, re) | 0, i = (i = i + Math.imul(p, ne) | 0) + Math.imul(b, re) | 0, 
                o = o + Math.imul(b, ne) | 0;
                var xe = (c + (n = n + Math.imul(d, oe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(d, ae) | 0) + Math.imul(h, oe) | 0)) << 13) | 0;
                c = ((o = o + Math.imul(h, ae) | 0) + (i >>> 13) | 0) + (xe >>> 26) | 0, xe &= 67108863, 
                n = Math.imul(j, z), i = (i = Math.imul(j, H)) + Math.imul(R, z) | 0, o = Math.imul(R, H), 
                n = n + Math.imul(T, W) | 0, i = (i = i + Math.imul(T, K) | 0) + Math.imul(I, W) | 0, 
                o = o + Math.imul(I, K) | 0, n = n + Math.imul(M, V) | 0, i = (i = i + Math.imul(M, J) | 0) + Math.imul(k, V) | 0, 
                o = o + Math.imul(k, J) | 0, n = n + Math.imul(S, X) | 0, i = (i = i + Math.imul(S, $) | 0) + Math.imul(A, X) | 0, 
                o = o + Math.imul(A, $) | 0, n = n + Math.imul(w, Q) | 0, i = (i = i + Math.imul(w, ee) | 0) + Math.imul(_, Q) | 0, 
                o = o + Math.imul(_, ee) | 0, n = n + Math.imul(g, re) | 0, i = (i = i + Math.imul(g, ne) | 0) + Math.imul(y, re) | 0, 
                o = o + Math.imul(y, ne) | 0, n = n + Math.imul(p, oe) | 0, i = (i = i + Math.imul(p, ae) | 0) + Math.imul(b, oe) | 0, 
                o = o + Math.imul(b, ae) | 0;
                var Se = (c + (n = n + Math.imul(d, fe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(d, ce) | 0) + Math.imul(h, fe) | 0)) << 13) | 0;
                c = ((o = o + Math.imul(h, ce) | 0) + (i >>> 13) | 0) + (Se >>> 26) | 0, Se &= 67108863, 
                n = Math.imul(P, z), i = (i = Math.imul(P, H)) + Math.imul(q, z) | 0, o = Math.imul(q, H), 
                n = n + Math.imul(j, W) | 0, i = (i = i + Math.imul(j, K) | 0) + Math.imul(R, W) | 0, 
                o = o + Math.imul(R, K) | 0, n = n + Math.imul(T, V) | 0, i = (i = i + Math.imul(T, J) | 0) + Math.imul(I, V) | 0, 
                o = o + Math.imul(I, J) | 0, n = n + Math.imul(M, X) | 0, i = (i = i + Math.imul(M, $) | 0) + Math.imul(k, X) | 0, 
                o = o + Math.imul(k, $) | 0, n = n + Math.imul(S, Q) | 0, i = (i = i + Math.imul(S, ee) | 0) + Math.imul(A, Q) | 0, 
                o = o + Math.imul(A, ee) | 0, n = n + Math.imul(w, re) | 0, i = (i = i + Math.imul(w, ne) | 0) + Math.imul(_, re) | 0, 
                o = o + Math.imul(_, ne) | 0, n = n + Math.imul(g, oe) | 0, i = (i = i + Math.imul(g, ae) | 0) + Math.imul(y, oe) | 0, 
                o = o + Math.imul(y, ae) | 0, n = n + Math.imul(p, fe) | 0, i = (i = i + Math.imul(p, ce) | 0) + Math.imul(b, fe) | 0, 
                o = o + Math.imul(b, ce) | 0;
                var Ae = (c + (n = n + Math.imul(d, de) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(d, he) | 0) + Math.imul(h, de) | 0)) << 13) | 0;
                c = ((o = o + Math.imul(h, he) | 0) + (i >>> 13) | 0) + (Ae >>> 26) | 0, Ae &= 67108863, 
                n = Math.imul(O, z), i = (i = Math.imul(O, H)) + Math.imul(L, z) | 0, o = Math.imul(L, H), 
                n = n + Math.imul(P, W) | 0, i = (i = i + Math.imul(P, K) | 0) + Math.imul(q, W) | 0, 
                o = o + Math.imul(q, K) | 0, n = n + Math.imul(j, V) | 0, i = (i = i + Math.imul(j, J) | 0) + Math.imul(R, V) | 0, 
                o = o + Math.imul(R, J) | 0, n = n + Math.imul(T, X) | 0, i = (i = i + Math.imul(T, $) | 0) + Math.imul(I, X) | 0, 
                o = o + Math.imul(I, $) | 0, n = n + Math.imul(M, Q) | 0, i = (i = i + Math.imul(M, ee) | 0) + Math.imul(k, Q) | 0, 
                o = o + Math.imul(k, ee) | 0, n = n + Math.imul(S, re) | 0, i = (i = i + Math.imul(S, ne) | 0) + Math.imul(A, re) | 0, 
                o = o + Math.imul(A, ne) | 0, n = n + Math.imul(w, oe) | 0, i = (i = i + Math.imul(w, ae) | 0) + Math.imul(_, oe) | 0, 
                o = o + Math.imul(_, ae) | 0, n = n + Math.imul(g, fe) | 0, i = (i = i + Math.imul(g, ce) | 0) + Math.imul(y, fe) | 0, 
                o = o + Math.imul(y, ce) | 0, n = n + Math.imul(p, de) | 0, i = (i = i + Math.imul(p, he) | 0) + Math.imul(b, de) | 0, 
                o = o + Math.imul(b, he) | 0;
                var Ee = (c + (n = n + Math.imul(d, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(d, be) | 0) + Math.imul(h, pe) | 0)) << 13) | 0;
                c = ((o = o + Math.imul(h, be) | 0) + (i >>> 13) | 0) + (Ee >>> 26) | 0, Ee &= 67108863, 
                n = Math.imul(O, W), i = (i = Math.imul(O, K)) + Math.imul(L, W) | 0, o = Math.imul(L, K), 
                n = n + Math.imul(P, V) | 0, i = (i = i + Math.imul(P, J) | 0) + Math.imul(q, V) | 0, 
                o = o + Math.imul(q, J) | 0, n = n + Math.imul(j, X) | 0, i = (i = i + Math.imul(j, $) | 0) + Math.imul(R, X) | 0, 
                o = o + Math.imul(R, $) | 0, n = n + Math.imul(T, Q) | 0, i = (i = i + Math.imul(T, ee) | 0) + Math.imul(I, Q) | 0, 
                o = o + Math.imul(I, ee) | 0, n = n + Math.imul(M, re) | 0, i = (i = i + Math.imul(M, ne) | 0) + Math.imul(k, re) | 0, 
                o = o + Math.imul(k, ne) | 0, n = n + Math.imul(S, oe) | 0, i = (i = i + Math.imul(S, ae) | 0) + Math.imul(A, oe) | 0, 
                o = o + Math.imul(A, ae) | 0, n = n + Math.imul(w, fe) | 0, i = (i = i + Math.imul(w, ce) | 0) + Math.imul(_, fe) | 0, 
                o = o + Math.imul(_, ce) | 0, n = n + Math.imul(g, de) | 0, i = (i = i + Math.imul(g, he) | 0) + Math.imul(y, de) | 0, 
                o = o + Math.imul(y, he) | 0;
                var Me = (c + (n = n + Math.imul(p, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(p, be) | 0) + Math.imul(b, pe) | 0)) << 13) | 0;
                c = ((o = o + Math.imul(b, be) | 0) + (i >>> 13) | 0) + (Me >>> 26) | 0, Me &= 67108863, 
                n = Math.imul(O, V), i = (i = Math.imul(O, J)) + Math.imul(L, V) | 0, o = Math.imul(L, J), 
                n = n + Math.imul(P, X) | 0, i = (i = i + Math.imul(P, $) | 0) + Math.imul(q, X) | 0, 
                o = o + Math.imul(q, $) | 0, n = n + Math.imul(j, Q) | 0, i = (i = i + Math.imul(j, ee) | 0) + Math.imul(R, Q) | 0, 
                o = o + Math.imul(R, ee) | 0, n = n + Math.imul(T, re) | 0, i = (i = i + Math.imul(T, ne) | 0) + Math.imul(I, re) | 0, 
                o = o + Math.imul(I, ne) | 0, n = n + Math.imul(M, oe) | 0, i = (i = i + Math.imul(M, ae) | 0) + Math.imul(k, oe) | 0, 
                o = o + Math.imul(k, ae) | 0, n = n + Math.imul(S, fe) | 0, i = (i = i + Math.imul(S, ce) | 0) + Math.imul(A, fe) | 0, 
                o = o + Math.imul(A, ce) | 0, n = n + Math.imul(w, de) | 0, i = (i = i + Math.imul(w, he) | 0) + Math.imul(_, de) | 0, 
                o = o + Math.imul(_, he) | 0;
                var ke = (c + (n = n + Math.imul(g, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(g, be) | 0) + Math.imul(y, pe) | 0)) << 13) | 0;
                c = ((o = o + Math.imul(y, be) | 0) + (i >>> 13) | 0) + (ke >>> 26) | 0, ke &= 67108863, 
                n = Math.imul(O, X), i = (i = Math.imul(O, $)) + Math.imul(L, X) | 0, o = Math.imul(L, $), 
                n = n + Math.imul(P, Q) | 0, i = (i = i + Math.imul(P, ee) | 0) + Math.imul(q, Q) | 0, 
                o = o + Math.imul(q, ee) | 0, n = n + Math.imul(j, re) | 0, i = (i = i + Math.imul(j, ne) | 0) + Math.imul(R, re) | 0, 
                o = o + Math.imul(R, ne) | 0, n = n + Math.imul(T, oe) | 0, i = (i = i + Math.imul(T, ae) | 0) + Math.imul(I, oe) | 0, 
                o = o + Math.imul(I, ae) | 0, n = n + Math.imul(M, fe) | 0, i = (i = i + Math.imul(M, ce) | 0) + Math.imul(k, fe) | 0, 
                o = o + Math.imul(k, ce) | 0, n = n + Math.imul(S, de) | 0, i = (i = i + Math.imul(S, he) | 0) + Math.imul(A, de) | 0, 
                o = o + Math.imul(A, he) | 0;
                var Ce = (c + (n = n + Math.imul(w, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(w, be) | 0) + Math.imul(_, pe) | 0)) << 13) | 0;
                c = ((o = o + Math.imul(_, be) | 0) + (i >>> 13) | 0) + (Ce >>> 26) | 0, Ce &= 67108863, 
                n = Math.imul(O, Q), i = (i = Math.imul(O, ee)) + Math.imul(L, Q) | 0, o = Math.imul(L, ee), 
                n = n + Math.imul(P, re) | 0, i = (i = i + Math.imul(P, ne) | 0) + Math.imul(q, re) | 0, 
                o = o + Math.imul(q, ne) | 0, n = n + Math.imul(j, oe) | 0, i = (i = i + Math.imul(j, ae) | 0) + Math.imul(R, oe) | 0, 
                o = o + Math.imul(R, ae) | 0, n = n + Math.imul(T, fe) | 0, i = (i = i + Math.imul(T, ce) | 0) + Math.imul(I, fe) | 0, 
                o = o + Math.imul(I, ce) | 0, n = n + Math.imul(M, de) | 0, i = (i = i + Math.imul(M, he) | 0) + Math.imul(k, de) | 0, 
                o = o + Math.imul(k, he) | 0;
                var Te = (c + (n = n + Math.imul(S, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(S, be) | 0) + Math.imul(A, pe) | 0)) << 13) | 0;
                c = ((o = o + Math.imul(A, be) | 0) + (i >>> 13) | 0) + (Te >>> 26) | 0, Te &= 67108863, 
                n = Math.imul(O, re), i = (i = Math.imul(O, ne)) + Math.imul(L, re) | 0, o = Math.imul(L, ne), 
                n = n + Math.imul(P, oe) | 0, i = (i = i + Math.imul(P, ae) | 0) + Math.imul(q, oe) | 0, 
                o = o + Math.imul(q, ae) | 0, n = n + Math.imul(j, fe) | 0, i = (i = i + Math.imul(j, ce) | 0) + Math.imul(R, fe) | 0, 
                o = o + Math.imul(R, ce) | 0, n = n + Math.imul(T, de) | 0, i = (i = i + Math.imul(T, he) | 0) + Math.imul(I, de) | 0, 
                o = o + Math.imul(I, he) | 0;
                var Ie = (c + (n = n + Math.imul(M, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(M, be) | 0) + Math.imul(k, pe) | 0)) << 13) | 0;
                c = ((o = o + Math.imul(k, be) | 0) + (i >>> 13) | 0) + (Ie >>> 26) | 0, Ie &= 67108863, 
                n = Math.imul(O, oe), i = (i = Math.imul(O, ae)) + Math.imul(L, oe) | 0, o = Math.imul(L, ae), 
                n = n + Math.imul(P, fe) | 0, i = (i = i + Math.imul(P, ce) | 0) + Math.imul(q, fe) | 0, 
                o = o + Math.imul(q, ce) | 0, n = n + Math.imul(j, de) | 0, i = (i = i + Math.imul(j, he) | 0) + Math.imul(R, de) | 0, 
                o = o + Math.imul(R, he) | 0;
                var Be = (c + (n = n + Math.imul(T, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(T, be) | 0) + Math.imul(I, pe) | 0)) << 13) | 0;
                c = ((o = o + Math.imul(I, be) | 0) + (i >>> 13) | 0) + (Be >>> 26) | 0, Be &= 67108863, 
                n = Math.imul(O, fe), i = (i = Math.imul(O, ce)) + Math.imul(L, fe) | 0, o = Math.imul(L, ce), 
                n = n + Math.imul(P, de) | 0, i = (i = i + Math.imul(P, he) | 0) + Math.imul(q, de) | 0, 
                o = o + Math.imul(q, he) | 0;
                var je = (c + (n = n + Math.imul(j, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(j, be) | 0) + Math.imul(R, pe) | 0)) << 13) | 0;
                c = ((o = o + Math.imul(R, be) | 0) + (i >>> 13) | 0) + (je >>> 26) | 0, je &= 67108863, 
                n = Math.imul(O, de), i = (i = Math.imul(O, he)) + Math.imul(L, de) | 0, o = Math.imul(L, he);
                var Re = (c + (n = n + Math.imul(P, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(P, be) | 0) + Math.imul(q, pe) | 0)) << 13) | 0;
                c = ((o = o + Math.imul(q, be) | 0) + (i >>> 13) | 0) + (Re >>> 26) | 0, Re &= 67108863;
                var De = (c + (n = Math.imul(O, pe)) | 0) + ((8191 & (i = (i = Math.imul(O, be)) + Math.imul(L, pe) | 0)) << 13) | 0;
                return c = ((o = Math.imul(L, be)) + (i >>> 13) | 0) + (De >>> 26) | 0, De &= 67108863, 
                f[0] = me, f[1] = ge, f[2] = ye, f[3] = ve, f[4] = we, f[5] = _e, f[6] = xe, f[7] = Se, 
                f[8] = Ae, f[9] = Ee, f[10] = Me, f[11] = ke, f[12] = Ce, f[13] = Te, f[14] = Ie, 
                f[15] = Be, f[16] = je, f[17] = Re, f[18] = De, 0 !== c && (f[19] = c, r.length++), 
                r;
            };
            function p(e, t, r) {
                return (new b).mulp(e, t, r);
            }
            function b(e, t) {
                this.x = e, this.y = t;
            }
            Math.imul || (l = h), o.prototype.mulTo = function(e, t) {
                var r = this.length + e.length;
                return 10 === this.length && 10 === e.length ? l(this, e, t) : r < 63 ? h(this, e, t) : r < 1024 ? function(e, t, r) {
                    r.negative = t.negative ^ e.negative, r.length = e.length + t.length;
                    for (var n = 0, i = 0, o = 0; o < r.length - 1; o++) {
                        var a = i;
                        i = 0;
                        for (var s = 67108863 & n, f = Math.min(o, t.length - 1), c = Math.max(0, o - e.length + 1); c <= f; c++) {
                            var u = o - c, d = (0 | e.words[u]) * (0 | t.words[c]), h = 67108863 & d;
                            s = 67108863 & (h = h + s | 0), i += (a = (a = a + (d / 67108864 | 0) | 0) + (h >>> 26) | 0) >>> 26, 
                            a &= 67108863;
                        }
                        r.words[o] = s, n = a, a = i;
                    }
                    return 0 !== n ? r.words[o] = n : r.length--, r.strip();
                }(this, e, t) : p(this, e, t);
            }, b.prototype.makeRBT = function(e) {
                for (var t = new Array(e), r = o.prototype._countBits(e) - 1, n = 0; n < e; n++) t[n] = this.revBin(n, r, e);
                return t;
            }, b.prototype.revBin = function(e, t, r) {
                if (0 === e || e === r - 1) return e;
                for (var n = 0, i = 0; i < t; i++) n |= (1 & e) << t - i - 1, e >>= 1;
                return n;
            }, b.prototype.permute = function(e, t, r, n, i, o) {
                for (var a = 0; a < o; a++) n[a] = t[e[a]], i[a] = r[e[a]];
            }, b.prototype.transform = function(e, t, r, n, i, o) {
                this.permute(o, e, t, r, n, i);
                for (var a = 1; a < i; a <<= 1) for (var s = a << 1, f = Math.cos(2 * Math.PI / s), c = Math.sin(2 * Math.PI / s), u = 0; u < i; u += s) for (var d = f, h = c, l = 0; l < a; l++) {
                    var p = r[u + l], b = n[u + l], m = r[u + l + a], g = n[u + l + a], y = d * m - h * g;
                    g = d * g + h * m, m = y, r[u + l] = p + m, n[u + l] = b + g, r[u + l + a] = p - m, 
                    n[u + l + a] = b - g, l !== s && (y = f * d - c * h, h = f * h + c * d, d = y);
                }
            }, b.prototype.guessLen13b = function(e, t) {
                var r = 1 | Math.max(t, e), n = 1 & r, i = 0;
                for (r = r / 2 | 0; r; r >>>= 1) i++;
                return 1 << i + 1 + n;
            }, b.prototype.conjugate = function(e, t, r) {
                if (!(r <= 1)) for (var n = 0; n < r / 2; n++) {
                    var i = e[n];
                    e[n] = e[r - n - 1], e[r - n - 1] = i, i = t[n], t[n] = -t[r - n - 1], t[r - n - 1] = -i;
                }
            }, b.prototype.normalize13b = function(e, t) {
                for (var r = 0, n = 0; n < t / 2; n++) {
                    var i = 8192 * Math.round(e[2 * n + 1] / t) + Math.round(e[2 * n] / t) + r;
                    e[n] = 67108863 & i, r = i < 67108864 ? 0 : i / 67108864 | 0;
                }
                return e;
            }, b.prototype.convert13b = function(e, t, r, i) {
                for (var o = 0, a = 0; a < t; a++) o += 0 | e[a], r[2 * a] = 8191 & o, o >>>= 13, 
                r[2 * a + 1] = 8191 & o, o >>>= 13;
                for (a = 2 * t; a < i; ++a) r[a] = 0;
                n(0 === o), n(0 == (-8192 & o));
            }, b.prototype.stub = function(e) {
                for (var t = new Array(e), r = 0; r < e; r++) t[r] = 0;
                return t;
            }, b.prototype.mulp = function(e, t, r) {
                var n = 2 * this.guessLen13b(e.length, t.length), i = this.makeRBT(n), o = this.stub(n), a = new Array(n), s = new Array(n), f = new Array(n), c = new Array(n), u = new Array(n), d = new Array(n), h = r.words;
                h.length = n, this.convert13b(e.words, e.length, a, n), this.convert13b(t.words, t.length, c, n), 
                this.transform(a, o, s, f, n, i), this.transform(c, o, u, d, n, i);
                for (var l = 0; l < n; l++) {
                    var p = s[l] * u[l] - f[l] * d[l];
                    f[l] = s[l] * d[l] + f[l] * u[l], s[l] = p;
                }
                return this.conjugate(s, f, n), this.transform(s, f, h, o, n, i), this.conjugate(h, o, n), 
                this.normalize13b(h, n), r.negative = e.negative ^ t.negative, r.length = e.length + t.length, 
                r.strip();
            }, o.prototype.mul = function(e) {
                var t = new o(null);
                return t.words = new Array(this.length + e.length), this.mulTo(e, t);
            }, o.prototype.mulf = function(e) {
                var t = new o(null);
                return t.words = new Array(this.length + e.length), p(this, e, t);
            }, o.prototype.imul = function(e) {
                return this.clone().mulTo(e, this);
            }, o.prototype.imuln = function(e) {
                n("number" == typeof e), n(e < 67108864);
                for (var t = 0, r = 0; r < this.length; r++) {
                    var i = (0 | this.words[r]) * e, o = (67108863 & i) + (67108863 & t);
                    t >>= 26, t += i / 67108864 | 0, t += o >>> 26, this.words[r] = 67108863 & o;
                }
                return 0 !== t && (this.words[r] = t, this.length++), this;
            }, o.prototype.muln = function(e) {
                return this.clone().imuln(e);
            }, o.prototype.sqr = function() {
                return this.mul(this);
            }, o.prototype.isqr = function() {
                return this.imul(this.clone());
            }, o.prototype.pow = function(e) {
                var t = function(e) {
                    for (var t = new Array(e.bitLength()), r = 0; r < t.length; r++) {
                        var n = r / 26 | 0, i = r % 26;
                        t[r] = (e.words[n] & 1 << i) >>> i;
                    }
                    return t;
                }(e);
                if (0 === t.length) return new o(1);
                for (var r = this, n = 0; n < t.length && 0 === t[n]; n++, r = r.sqr()) ;
                if (++n < t.length) for (var i = r.sqr(); n < t.length; n++, i = i.sqr()) 0 !== t[n] && (r = r.mul(i));
                return r;
            }, o.prototype.iushln = function(e) {
                n("number" == typeof e && e >= 0);
                var t, r = e % 26, i = (e - r) / 26, o = 67108863 >>> 26 - r << 26 - r;
                if (0 !== r) {
                    var a = 0;
                    for (t = 0; t < this.length; t++) {
                        var s = this.words[t] & o, f = (0 | this.words[t]) - s << r;
                        this.words[t] = f | a, a = s >>> 26 - r;
                    }
                    a && (this.words[t] = a, this.length++);
                }
                if (0 !== i) {
                    for (t = this.length - 1; t >= 0; t--) this.words[t + i] = this.words[t];
                    for (t = 0; t < i; t++) this.words[t] = 0;
                    this.length += i;
                }
                return this.strip();
            }, o.prototype.ishln = function(e) {
                return n(0 === this.negative), this.iushln(e);
            }, o.prototype.iushrn = function(e, t, r) {
                var i;
                n("number" == typeof e && e >= 0), i = t ? (t - t % 26) / 26 : 0;
                var o = e % 26, a = Math.min((e - o) / 26, this.length), s = 67108863 ^ 67108863 >>> o << o, f = r;
                if (i -= a, i = Math.max(0, i), f) {
                    for (var c = 0; c < a; c++) f.words[c] = this.words[c];
                    f.length = a;
                }
                if (0 === a) ; else if (this.length > a) for (this.length -= a, c = 0; c < this.length; c++) this.words[c] = this.words[c + a]; else this.words[0] = 0, 
                this.length = 1;
                var u = 0;
                for (c = this.length - 1; c >= 0 && (0 !== u || c >= i); c--) {
                    var d = 0 | this.words[c];
                    this.words[c] = u << 26 - o | d >>> o, u = d & s;
                }
                return f && 0 !== u && (f.words[f.length++] = u), 0 === this.length && (this.words[0] = 0, 
                this.length = 1), this.strip();
            }, o.prototype.ishrn = function(e, t, r) {
                return n(0 === this.negative), this.iushrn(e, t, r);
            }, o.prototype.shln = function(e) {
                return this.clone().ishln(e);
            }, o.prototype.ushln = function(e) {
                return this.clone().iushln(e);
            }, o.prototype.shrn = function(e) {
                return this.clone().ishrn(e);
            }, o.prototype.ushrn = function(e) {
                return this.clone().iushrn(e);
            }, o.prototype.testn = function(e) {
                n("number" == typeof e && e >= 0);
                var t = e % 26, r = (e - t) / 26, i = 1 << t;
                return !(this.length <= r) && !!(this.words[r] & i);
            }, o.prototype.imaskn = function(e) {
                n("number" == typeof e && e >= 0);
                var t = e % 26, r = (e - t) / 26;
                if (n(0 === this.negative, "imaskn works only with positive numbers"), this.length <= r) return this;
                if (0 !== t && r++, this.length = Math.min(r, this.length), 0 !== t) {
                    var i = 67108863 ^ 67108863 >>> t << t;
                    this.words[this.length - 1] &= i;
                }
                return this.strip();
            }, o.prototype.maskn = function(e) {
                return this.clone().imaskn(e);
            }, o.prototype.iaddn = function(e) {
                return n("number" == typeof e), n(e < 67108864), e < 0 ? this.isubn(-e) : 0 !== this.negative ? 1 === this.length && (0 | this.words[0]) < e ? (this.words[0] = e - (0 | this.words[0]), 
                this.negative = 0, this) : (this.negative = 0, this.isubn(e), this.negative = 1, 
                this) : this._iaddn(e);
            }, o.prototype._iaddn = function(e) {
                this.words[0] += e;
                for (var t = 0; t < this.length && this.words[t] >= 67108864; t++) this.words[t] -= 67108864, 
                t === this.length - 1 ? this.words[t + 1] = 1 : this.words[t + 1]++;
                return this.length = Math.max(this.length, t + 1), this;
            }, o.prototype.isubn = function(e) {
                if (n("number" == typeof e), n(e < 67108864), e < 0) return this.iaddn(-e);
                if (0 !== this.negative) return this.negative = 0, this.iaddn(e), this.negative = 1, 
                this;
                if (this.words[0] -= e, 1 === this.length && this.words[0] < 0) this.words[0] = -this.words[0], 
                this.negative = 1; else for (var t = 0; t < this.length && this.words[t] < 0; t++) this.words[t] += 67108864, 
                this.words[t + 1] -= 1;
                return this.strip();
            }, o.prototype.addn = function(e) {
                return this.clone().iaddn(e);
            }, o.prototype.subn = function(e) {
                return this.clone().isubn(e);
            }, o.prototype.iabs = function() {
                return this.negative = 0, this;
            }, o.prototype.abs = function() {
                return this.clone().iabs();
            }, o.prototype._ishlnsubmul = function(e, t, r) {
                var i, o, a = e.length + r;
                this._expand(a);
                var s = 0;
                for (i = 0; i < e.length; i++) {
                    o = (0 | this.words[i + r]) + s;
                    var f = (0 | e.words[i]) * t;
                    s = ((o -= 67108863 & f) >> 26) - (f / 67108864 | 0), this.words[i + r] = 67108863 & o;
                }
                for (;i < this.length - r; i++) s = (o = (0 | this.words[i + r]) + s) >> 26, this.words[i + r] = 67108863 & o;
                if (0 === s) return this.strip();
                for (n(-1 === s), s = 0, i = 0; i < this.length; i++) s = (o = -(0 | this.words[i]) + s) >> 26, 
                this.words[i] = 67108863 & o;
                return this.negative = 1, this.strip();
            }, o.prototype._wordDiv = function(e, t) {
                var r = (this.length, e.length), n = this.clone(), i = e, a = 0 | i.words[i.length - 1];
                0 !== (r = 26 - this._countBits(a)) && (i = i.ushln(r), n.iushln(r), a = 0 | i.words[i.length - 1]);
                var s, f = n.length - i.length;
                if ("mod" !== t) {
                    (s = new o(null)).length = f + 1, s.words = new Array(s.length);
                    for (var c = 0; c < s.length; c++) s.words[c] = 0;
                }
                var u = n.clone()._ishlnsubmul(i, 1, f);
                0 === u.negative && (n = u, s && (s.words[f] = 1));
                for (var d = f - 1; d >= 0; d--) {
                    var h = 67108864 * (0 | n.words[i.length + d]) + (0 | n.words[i.length + d - 1]);
                    for (h = Math.min(h / a | 0, 67108863), n._ishlnsubmul(i, h, d); 0 !== n.negative; ) h--, 
                    n.negative = 0, n._ishlnsubmul(i, 1, d), n.isZero() || (n.negative ^= 1);
                    s && (s.words[d] = h);
                }
                return s && s.strip(), n.strip(), "div" !== t && 0 !== r && n.iushrn(r), {
                    div: s || null,
                    mod: n
                };
            }, o.prototype.divmod = function(e, t, r) {
                return n(!e.isZero()), this.isZero() ? {
                    div: new o(0),
                    mod: new o(0)
                } : 0 !== this.negative && 0 === e.negative ? (s = this.neg().divmod(e, t), "mod" !== t && (i = s.div.neg()), 
                "div" !== t && (a = s.mod.neg(), r && 0 !== a.negative && a.iadd(e)), {
                    div: i,
                    mod: a
                }) : 0 === this.negative && 0 !== e.negative ? (s = this.divmod(e.neg(), t), "mod" !== t && (i = s.div.neg()), 
                {
                    div: i,
                    mod: s.mod
                }) : 0 != (this.negative & e.negative) ? (s = this.neg().divmod(e.neg(), t), "div" !== t && (a = s.mod.neg(), 
                r && 0 !== a.negative && a.isub(e)), {
                    div: s.div,
                    mod: a
                }) : e.length > this.length || this.cmp(e) < 0 ? {
                    div: new o(0),
                    mod: this
                } : 1 === e.length ? "div" === t ? {
                    div: this.divn(e.words[0]),
                    mod: null
                } : "mod" === t ? {
                    div: null,
                    mod: new o(this.modn(e.words[0]))
                } : {
                    div: this.divn(e.words[0]),
                    mod: new o(this.modn(e.words[0]))
                } : this._wordDiv(e, t);
                var i, a, s;
            }, o.prototype.div = function(e) {
                return this.divmod(e, "div", !1).div;
            }, o.prototype.mod = function(e) {
                return this.divmod(e, "mod", !1).mod;
            }, o.prototype.umod = function(e) {
                return this.divmod(e, "mod", !0).mod;
            }, o.prototype.divRound = function(e) {
                var t = this.divmod(e);
                if (t.mod.isZero()) return t.div;
                var r = 0 !== t.div.negative ? t.mod.isub(e) : t.mod, n = e.ushrn(1), i = e.andln(1), o = r.cmp(n);
                return o < 0 || 1 === i && 0 === o ? t.div : 0 !== t.div.negative ? t.div.isubn(1) : t.div.iaddn(1);
            }, o.prototype.modn = function(e) {
                n(e <= 67108863);
                for (var t = (1 << 26) % e, r = 0, i = this.length - 1; i >= 0; i--) r = (t * r + (0 | this.words[i])) % e;
                return r;
            }, o.prototype.idivn = function(e) {
                n(e <= 67108863);
                for (var t = 0, r = this.length - 1; r >= 0; r--) {
                    var i = (0 | this.words[r]) + 67108864 * t;
                    this.words[r] = i / e | 0, t = i % e;
                }
                return this.strip();
            }, o.prototype.divn = function(e) {
                return this.clone().idivn(e);
            }, o.prototype.egcd = function(e) {
                n(0 === e.negative), n(!e.isZero());
                var t = this, r = e.clone();
                t = 0 !== t.negative ? t.umod(e) : t.clone();
                for (var i = new o(1), a = new o(0), s = new o(0), f = new o(1), c = 0; t.isEven() && r.isEven(); ) t.iushrn(1), 
                r.iushrn(1), ++c;
                for (var u = r.clone(), d = t.clone(); !t.isZero(); ) {
                    for (var h = 0, l = 1; 0 == (t.words[0] & l) && h < 26; ++h, l <<= 1) ;
                    if (h > 0) for (t.iushrn(h); h-- > 0; ) (i.isOdd() || a.isOdd()) && (i.iadd(u), 
                    a.isub(d)), i.iushrn(1), a.iushrn(1);
                    for (var p = 0, b = 1; 0 == (r.words[0] & b) && p < 26; ++p, b <<= 1) ;
                    if (p > 0) for (r.iushrn(p); p-- > 0; ) (s.isOdd() || f.isOdd()) && (s.iadd(u), 
                    f.isub(d)), s.iushrn(1), f.iushrn(1);
                    t.cmp(r) >= 0 ? (t.isub(r), i.isub(s), a.isub(f)) : (r.isub(t), s.isub(i), f.isub(a));
                }
                return {
                    a: s,
                    b: f,
                    gcd: r.iushln(c)
                };
            }, o.prototype._invmp = function(e) {
                n(0 === e.negative), n(!e.isZero());
                var t = this, r = e.clone();
                t = 0 !== t.negative ? t.umod(e) : t.clone();
                for (var i, a = new o(1), s = new o(0), f = r.clone(); t.cmpn(1) > 0 && r.cmpn(1) > 0; ) {
                    for (var c = 0, u = 1; 0 == (t.words[0] & u) && c < 26; ++c, u <<= 1) ;
                    if (c > 0) for (t.iushrn(c); c-- > 0; ) a.isOdd() && a.iadd(f), a.iushrn(1);
                    for (var d = 0, h = 1; 0 == (r.words[0] & h) && d < 26; ++d, h <<= 1) ;
                    if (d > 0) for (r.iushrn(d); d-- > 0; ) s.isOdd() && s.iadd(f), s.iushrn(1);
                    t.cmp(r) >= 0 ? (t.isub(r), a.isub(s)) : (r.isub(t), s.isub(a));
                }
                return (i = 0 === t.cmpn(1) ? a : s).cmpn(0) < 0 && i.iadd(e), i;
            }, o.prototype.gcd = function(e) {
                if (this.isZero()) return e.abs();
                if (e.isZero()) return this.abs();
                var t = this.clone(), r = e.clone();
                t.negative = 0, r.negative = 0;
                for (var n = 0; t.isEven() && r.isEven(); n++) t.iushrn(1), r.iushrn(1);
                for (;;) {
                    for (;t.isEven(); ) t.iushrn(1);
                    for (;r.isEven(); ) r.iushrn(1);
                    var i = t.cmp(r);
                    if (i < 0) {
                        var o = t;
                        t = r, r = o;
                    } else if (0 === i || 0 === r.cmpn(1)) break;
                    t.isub(r);
                }
                return r.iushln(n);
            }, o.prototype.invm = function(e) {
                return this.egcd(e).a.umod(e);
            }, o.prototype.isEven = function() {
                return 0 == (1 & this.words[0]);
            }, o.prototype.isOdd = function() {
                return 1 == (1 & this.words[0]);
            }, o.prototype.andln = function(e) {
                return this.words[0] & e;
            }, o.prototype.bincn = function(e) {
                n("number" == typeof e);
                var t = e % 26, r = (e - t) / 26, i = 1 << t;
                if (this.length <= r) return this._expand(r + 1), this.words[r] |= i, this;
                for (var o = i, a = r; 0 !== o && a < this.length; a++) {
                    var s = 0 | this.words[a];
                    o = (s += o) >>> 26, s &= 67108863, this.words[a] = s;
                }
                return 0 !== o && (this.words[a] = o, this.length++), this;
            }, o.prototype.isZero = function() {
                return 1 === this.length && 0 === this.words[0];
            }, o.prototype.cmpn = function(e) {
                var t, r = e < 0;
                if (0 !== this.negative && !r) return -1;
                if (0 === this.negative && r) return 1;
                if (this.strip(), this.length > 1) t = 1; else {
                    r && (e = -e), n(e <= 67108863, "Number is too big");
                    var i = 0 | this.words[0];
                    t = i === e ? 0 : i < e ? -1 : 1;
                }
                return 0 !== this.negative ? 0 | -t : t;
            }, o.prototype.cmp = function(e) {
                if (0 !== this.negative && 0 === e.negative) return -1;
                if (0 === this.negative && 0 !== e.negative) return 1;
                var t = this.ucmp(e);
                return 0 !== this.negative ? 0 | -t : t;
            }, o.prototype.ucmp = function(e) {
                if (this.length > e.length) return 1;
                if (this.length < e.length) return -1;
                for (var t = 0, r = this.length - 1; r >= 0; r--) {
                    var n = 0 | this.words[r], i = 0 | e.words[r];
                    if (n !== i) {
                        n < i ? t = -1 : n > i && (t = 1);
                        break;
                    }
                }
                return t;
            }, o.prototype.gtn = function(e) {
                return 1 === this.cmpn(e);
            }, o.prototype.gt = function(e) {
                return 1 === this.cmp(e);
            }, o.prototype.gten = function(e) {
                return this.cmpn(e) >= 0;
            }, o.prototype.gte = function(e) {
                return this.cmp(e) >= 0;
            }, o.prototype.ltn = function(e) {
                return -1 === this.cmpn(e);
            }, o.prototype.lt = function(e) {
                return -1 === this.cmp(e);
            }, o.prototype.lten = function(e) {
                return this.cmpn(e) <= 0;
            }, o.prototype.lte = function(e) {
                return this.cmp(e) <= 0;
            }, o.prototype.eqn = function(e) {
                return 0 === this.cmpn(e);
            }, o.prototype.eq = function(e) {
                return 0 === this.cmp(e);
            }, o.red = function(e) {
                return new x(e);
            }, o.prototype.toRed = function(e) {
                return n(!this.red, "Already a number in reduction context"), n(0 === this.negative, "red works only with positives"), 
                e.convertTo(this)._forceRed(e);
            }, o.prototype.fromRed = function() {
                return n(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
            }, o.prototype._forceRed = function(e) {
                return this.red = e, this;
            }, o.prototype.forceRed = function(e) {
                return n(!this.red, "Already a number in reduction context"), this._forceRed(e);
            }, o.prototype.redAdd = function(e) {
                return n(this.red, "redAdd works only with red numbers"), this.red.add(this, e);
            }, o.prototype.redIAdd = function(e) {
                return n(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, e);
            }, o.prototype.redSub = function(e) {
                return n(this.red, "redSub works only with red numbers"), this.red.sub(this, e);
            }, o.prototype.redISub = function(e) {
                return n(this.red, "redISub works only with red numbers"), this.red.isub(this, e);
            }, o.prototype.redShl = function(e) {
                return n(this.red, "redShl works only with red numbers"), this.red.shl(this, e);
            }, o.prototype.redMul = function(e) {
                return n(this.red, "redMul works only with red numbers"), this.red._verify2(this, e), 
                this.red.mul(this, e);
            }, o.prototype.redIMul = function(e) {
                return n(this.red, "redMul works only with red numbers"), this.red._verify2(this, e), 
                this.red.imul(this, e);
            }, o.prototype.redSqr = function() {
                return n(this.red, "redSqr works only with red numbers"), this.red._verify1(this), 
                this.red.sqr(this);
            }, o.prototype.redISqr = function() {
                return n(this.red, "redISqr works only with red numbers"), this.red._verify1(this), 
                this.red.isqr(this);
            }, o.prototype.redSqrt = function() {
                return n(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), 
                this.red.sqrt(this);
            }, o.prototype.redInvm = function() {
                return n(this.red, "redInvm works only with red numbers"), this.red._verify1(this), 
                this.red.invm(this);
            }, o.prototype.redNeg = function() {
                return n(this.red, "redNeg works only with red numbers"), this.red._verify1(this), 
                this.red.neg(this);
            }, o.prototype.redPow = function(e) {
                return n(this.red && !e.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, e);
            };
            var m = {
                k256: null,
                p224: null,
                p192: null,
                p25519: null
            };
            function g(e, t) {
                this.name = e, this.p = new o(t, 16), this.n = this.p.bitLength(), this.k = new o(1).iushln(this.n).isub(this.p), 
                this.tmp = this._tmp();
            }
            function y() {
                g.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f");
            }
            function v() {
                g.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001");
            }
            function w() {
                g.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff");
            }
            function _() {
                g.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed");
            }
            function x(e) {
                if ("string" == typeof e) {
                    var t = o._prime(e);
                    this.m = t.p, this.prime = t;
                } else n(e.gtn(1), "modulus must be greater than 1"), this.m = e, this.prime = null;
            }
            function S(e) {
                x.call(this, e), this.shift = this.m.bitLength(), this.shift % 26 != 0 && (this.shift += 26 - this.shift % 26), 
                this.r = new o(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), 
                this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), 
                this.minv = this.r.sub(this.minv);
            }
            g.prototype._tmp = function() {
                var e = new o(null);
                return e.words = new Array(Math.ceil(this.n / 13)), e;
            }, g.prototype.ireduce = function(e) {
                var t, r = e;
                do {
                    this.split(r, this.tmp), t = (r = (r = this.imulK(r)).iadd(this.tmp)).bitLength();
                } while (t > this.n);
                var n = t < this.n ? -1 : r.ucmp(this.p);
                return 0 === n ? (r.words[0] = 0, r.length = 1) : n > 0 ? r.isub(this.p) : r.strip(), 
                r;
            }, g.prototype.split = function(e, t) {
                e.iushrn(this.n, 0, t);
            }, g.prototype.imulK = function(e) {
                return e.imul(this.k);
            }, i(y, g), y.prototype.split = function(e, t) {
                for (var r = Math.min(e.length, 9), n = 0; n < r; n++) t.words[n] = e.words[n];
                if (t.length = r, e.length <= 9) return e.words[0] = 0, void (e.length = 1);
                var i = e.words[9];
                for (t.words[t.length++] = 4194303 & i, n = 10; n < e.length; n++) {
                    var o = 0 | e.words[n];
                    e.words[n - 10] = (4194303 & o) << 4 | i >>> 22, i = o;
                }
                i >>>= 22, e.words[n - 10] = i, 0 === i && e.length > 10 ? e.length -= 10 : e.length -= 9;
            }, y.prototype.imulK = function(e) {
                e.words[e.length] = 0, e.words[e.length + 1] = 0, e.length += 2;
                for (var t = 0, r = 0; r < e.length; r++) {
                    var n = 0 | e.words[r];
                    t += 977 * n, e.words[r] = 67108863 & t, t = 64 * n + (t / 67108864 | 0);
                }
                return 0 === e.words[e.length - 1] && (e.length--, 0 === e.words[e.length - 1] && e.length--), 
                e;
            }, i(v, g), i(w, g), i(_, g), _.prototype.imulK = function(e) {
                for (var t = 0, r = 0; r < e.length; r++) {
                    var n = 19 * (0 | e.words[r]) + t, i = 67108863 & n;
                    n >>>= 26, e.words[r] = i, t = n;
                }
                return 0 !== t && (e.words[e.length++] = t), e;
            }, o._prime = function(e) {
                if (m[e]) return m[e];
                var t;
                if ("k256" === e) t = new y; else if ("p224" === e) t = new v; else if ("p192" === e) t = new w; else {
                    if ("p25519" !== e) throw new Error("Unknown prime " + e);
                    t = new _;
                }
                return m[e] = t, t;
            }, x.prototype._verify1 = function(e) {
                n(0 === e.negative, "red works only with positives"), n(e.red, "red works only with red numbers");
            }, x.prototype._verify2 = function(e, t) {
                n(0 == (e.negative | t.negative), "red works only with positives"), n(e.red && e.red === t.red, "red works only with red numbers");
            }, x.prototype.imod = function(e) {
                return this.prime ? this.prime.ireduce(e)._forceRed(this) : e.umod(this.m)._forceRed(this);
            }, x.prototype.neg = function(e) {
                return e.isZero() ? e.clone() : this.m.sub(e)._forceRed(this);
            }, x.prototype.add = function(e, t) {
                this._verify2(e, t);
                var r = e.add(t);
                return r.cmp(this.m) >= 0 && r.isub(this.m), r._forceRed(this);
            }, x.prototype.iadd = function(e, t) {
                this._verify2(e, t);
                var r = e.iadd(t);
                return r.cmp(this.m) >= 0 && r.isub(this.m), r;
            }, x.prototype.sub = function(e, t) {
                this._verify2(e, t);
                var r = e.sub(t);
                return r.cmpn(0) < 0 && r.iadd(this.m), r._forceRed(this);
            }, x.prototype.isub = function(e, t) {
                this._verify2(e, t);
                var r = e.isub(t);
                return r.cmpn(0) < 0 && r.iadd(this.m), r;
            }, x.prototype.shl = function(e, t) {
                return this._verify1(e), this.imod(e.ushln(t));
            }, x.prototype.imul = function(e, t) {
                return this._verify2(e, t), this.imod(e.imul(t));
            }, x.prototype.mul = function(e, t) {
                return this._verify2(e, t), this.imod(e.mul(t));
            }, x.prototype.isqr = function(e) {
                return this.imul(e, e.clone());
            }, x.prototype.sqr = function(e) {
                return this.mul(e, e);
            }, x.prototype.sqrt = function(e) {
                if (e.isZero()) return e.clone();
                var t = this.m.andln(3);
                if (n(t % 2 == 1), 3 === t) {
                    var r = this.m.add(new o(1)).iushrn(2);
                    return this.pow(e, r);
                }
                for (var i = this.m.subn(1), a = 0; !i.isZero() && 0 === i.andln(1); ) a++, i.iushrn(1);
                n(!i.isZero());
                var s = new o(1).toRed(this), f = s.redNeg(), c = this.m.subn(1).iushrn(1), u = this.m.bitLength();
                for (u = new o(2 * u * u).toRed(this); 0 !== this.pow(u, c).cmp(f); ) u.redIAdd(f);
                for (var d = this.pow(u, i), h = this.pow(e, i.addn(1).iushrn(1)), l = this.pow(e, i), p = a; 0 !== l.cmp(s); ) {
                    for (var b = l, m = 0; 0 !== b.cmp(s); m++) b = b.redSqr();
                    n(m < p);
                    var g = this.pow(d, new o(1).iushln(p - m - 1));
                    h = h.redMul(g), d = g.redSqr(), l = l.redMul(d), p = m;
                }
                return h;
            }, x.prototype.invm = function(e) {
                var t = e._invmp(this.m);
                return 0 !== t.negative ? (t.negative = 0, this.imod(t).redNeg()) : this.imod(t);
            }, x.prototype.pow = function(e, t) {
                if (t.isZero()) return new o(1).toRed(this);
                if (0 === t.cmpn(1)) return e.clone();
                var r = new Array(16);
                r[0] = new o(1).toRed(this), r[1] = e;
                for (var n = 2; n < r.length; n++) r[n] = this.mul(r[n - 1], e);
                var i = r[0], a = 0, s = 0, f = t.bitLength() % 26;
                for (0 === f && (f = 26), n = t.length - 1; n >= 0; n--) {
                    for (var c = t.words[n], u = f - 1; u >= 0; u--) {
                        var d = c >> u & 1;
                        i !== r[0] && (i = this.sqr(i)), 0 !== d || 0 !== a ? (a <<= 1, a |= d, (4 === ++s || 0 === n && 0 === u) && (i = this.mul(i, r[a]), 
                        s = 0, a = 0)) : s = 0;
                    }
                    f = 26;
                }
                return i;
            }, x.prototype.convertTo = function(e) {
                var t = e.umod(this.m);
                return t === e ? t.clone() : t;
            }, x.prototype.convertFrom = function(e) {
                var t = e.clone();
                return t.red = null, t;
            }, o.mont = function(e) {
                return new S(e);
            }, i(S, x), S.prototype.convertTo = function(e) {
                return this.imod(e.ushln(this.shift));
            }, S.prototype.convertFrom = function(e) {
                var t = this.imod(e.mul(this.rinv));
                return t.red = null, t;
            }, S.prototype.imul = function(e, t) {
                if (e.isZero() || t.isZero()) return e.words[0] = 0, e.length = 1, e;
                var r = e.imul(t), n = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), i = r.isub(n).iushrn(this.shift), o = i;
                return i.cmp(this.m) >= 0 ? o = i.isub(this.m) : i.cmpn(0) < 0 && (o = i.iadd(this.m)), 
                o._forceRed(this);
            }, S.prototype.mul = function(e, t) {
                if (e.isZero() || t.isZero()) return new o(0)._forceRed(this);
                var r = e.mul(t), n = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), i = r.isub(n).iushrn(this.shift), a = i;
                return i.cmp(this.m) >= 0 ? a = i.isub(this.m) : i.cmpn(0) < 0 && (a = i.iadd(this.m)), 
                a._forceRed(this);
            }, S.prototype.invm = function(e) {
                return this.imod(e._invmp(this.m).mul(this.r2))._forceRed(this);
            };
        }(e, this);
    }).call(this, r(96)(e));
}, function(e, t) {
    e.exports = function(e) {
        return e.webpackPolyfill || (e.deprecate = function() {}, e.paths = [], e.children || (e.children = []), 
        Object.defineProperty(e, "loaded", {
            enumerable: !0,
            get: function() {
                return e.l;
            }
        }), Object.defineProperty(e, "id", {
            enumerable: !0,
            get: function() {
                return e.i;
            }
        }), e.webpackPolyfill = 1), e;
    };
}, function(e, t) {}, function(e, t, r) {
    var n = r(95), i = r(99);
    function o(e) {
        this.rand = e || new i.Rand;
    }
    e.exports = o, o.create = function(e) {
        return new o(e);
    }, o.prototype._randbelow = function(e) {
        var t = e.bitLength(), r = Math.ceil(t / 8);
        do {
            var i = new n(this.rand.generate(r));
        } while (i.cmp(e) >= 0);
        return i;
    }, o.prototype._randrange = function(e, t) {
        var r = t.sub(e);
        return e.add(this._randbelow(r));
    }, o.prototype.test = function(e, t, r) {
        var i = e.bitLength(), o = n.mont(e), a = new n(1).toRed(o);
        t || (t = Math.max(1, i / 48 | 0));
        for (var s = e.subn(1), f = 0; !s.testn(f); f++) ;
        for (var c = e.shrn(f), u = s.toRed(o); t > 0; t--) {
            var d = this._randrange(new n(2), s);
            r && r(d);
            var h = d.toRed(o).redPow(c);
            if (0 !== h.cmp(a) && 0 !== h.cmp(u)) {
                for (var l = 1; l < f; l++) {
                    if (0 === (h = h.redSqr()).cmp(a)) return !1;
                    if (0 === h.cmp(u)) break;
                }
                if (l === f) return !1;
            }
        }
        return !0;
    }, o.prototype.getDivisor = function(e, t) {
        var r = e.bitLength(), i = n.mont(e), o = new n(1).toRed(i);
        t || (t = Math.max(1, r / 48 | 0));
        for (var a = e.subn(1), s = 0; !a.testn(s); s++) ;
        for (var f = e.shrn(s), c = a.toRed(i); t > 0; t--) {
            var u = this._randrange(new n(2), a), d = e.gcd(u);
            if (0 !== d.cmpn(1)) return d;
            var h = u.toRed(i).redPow(f);
            if (0 !== h.cmp(o) && 0 !== h.cmp(c)) {
                for (var l = 1; l < s; l++) {
                    if (0 === (h = h.redSqr()).cmp(o)) return h.fromRed().subn(1).gcd(e);
                    if (0 === h.cmp(c)) break;
                }
                if (l === s) return (h = h.redSqr()).fromRed().subn(1).gcd(e);
            }
        }
        return !1;
    };
}, function(e, t, r) {
    var n;
    function i(e) {
        this.rand = e;
    }
    if (e.exports = function(e) {
        return n || (n = new i(null)), n.generate(e);
    }, e.exports.Rand = i, i.prototype.generate = function(e) {
        return this._rand(e);
    }, i.prototype._rand = function(e) {
        if (this.rand.getBytes) return this.rand.getBytes(e);
        for (var t = new Uint8Array(e), r = 0; r < t.length; r++) t[r] = this.rand.getByte();
        return t;
    }, "object" == typeof self) self.crypto && self.crypto.getRandomValues ? i.prototype._rand = function(e) {
        var t = new Uint8Array(e);
        return self.crypto.getRandomValues(t), t;
    } : self.msCrypto && self.msCrypto.getRandomValues ? i.prototype._rand = function(e) {
        var t = new Uint8Array(e);
        return self.msCrypto.getRandomValues(t), t;
    } : "object" == typeof window && (i.prototype._rand = function() {
        throw new Error("Not implemented yet");
    }); else try {
        var o = r(100);
        if ("function" != typeof o.randomBytes) throw new Error("Not supported");
        i.prototype._rand = function(e) {
            return o.randomBytes(e);
        };
    } catch (e) {}
}, function(e, t) {}, function(e) {
    e.exports = JSON.parse('{"modp1":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a63a3620ffffffffffffffff"},"modp2":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece65381ffffffffffffffff"},"modp5":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffff"},"modp14":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aacaa68ffffffffffffffff"},"modp15":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a93ad2caffffffffffffffff"},"modp16":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c934063199ffffffffffffffff"},"modp17":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dcc4024ffffffffffffffff"},"modp18":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dbe115974a3926f12fee5e438777cb6a932df8cd8bec4d073b931ba3bc832b68d9dd300741fa7bf8afc47ed2576f6936ba424663aab639c5ae4f5683423b4742bf1c978238f16cbe39d652de3fdb8befc848ad922222e04a4037c0713eb57a81a23f0c73473fc646cea306b4bcbc8862f8385ddfa9d4b7fa2c087e879683303ed5bdd3a062b3cf5b3a278a66d2a13f83f44f82ddf310ee074ab6a364597e899a0255dc164f31cc50846851df9ab48195ded7ea1b1d510bd7ee74d73faf36bc31ecfa268359046f4eb879f924009438b481c6cd7889a002ed5ee382bc9190da6fc026e479558e4475677e9aa9e3050e2765694dfc81f56e880b96e7160c980dd98edd3dfffffffffffffffff"}}');
}, function(e, t, r) {
    (function(t) {
        var n = r(95), i = new (r(98)), o = new n(24), a = new n(11), s = new n(10), f = new n(3), c = new n(7), u = r(94), d = r(9);
        function h(e, r) {
            return r = r || "utf8", t.isBuffer(e) || (e = new t(e, r)), this._pub = new n(e), 
            this;
        }
        function l(e, r) {
            return r = r || "utf8", t.isBuffer(e) || (e = new t(e, r)), this._priv = new n(e), 
            this;
        }
        e.exports = b;
        var p = {};
        function b(e, t, r) {
            this.setGenerator(t), this.__prime = new n(e), this._prime = n.mont(this.__prime), 
            this._primeLen = e.length, this._pub = void 0, this._priv = void 0, this._primeCode = void 0, 
            r ? (this.setPublicKey = h, this.setPrivateKey = l) : this._primeCode = 8;
        }
        function m(e, r) {
            var n = new t(e.toArray());
            return r ? n.toString(r) : n;
        }
        Object.defineProperty(b.prototype, "verifyError", {
            enumerable: !0,
            get: function() {
                return "number" != typeof this._primeCode && (this._primeCode = function(e, t) {
                    var r = t.toString("hex"), n = [ r, e.toString(16) ].join("_");
                    if (n in p) return p[n];
                    var d, h = 0;
                    if (e.isEven() || !u.simpleSieve || !u.fermatTest(e) || !i.test(e)) return h += 1, 
                    h += "02" === r || "05" === r ? 8 : 4, p[n] = h, h;
                    switch (i.test(e.shrn(1)) || (h += 2), r) {
                      case "02":
                        e.mod(o).cmp(a) && (h += 8);
                        break;

                      case "05":
                        (d = e.mod(s)).cmp(f) && d.cmp(c) && (h += 8);
                        break;

                      default:
                        h += 4;
                    }
                    return p[n] = h, h;
                }(this.__prime, this.__gen)), this._primeCode;
            }
        }), b.prototype.generateKeys = function() {
            return this._priv || (this._priv = new n(d(this._primeLen))), this._pub = this._gen.toRed(this._prime).redPow(this._priv).fromRed(), 
            this.getPublicKey();
        }, b.prototype.computeSecret = function(e) {
            var r = (e = (e = new n(e)).toRed(this._prime)).redPow(this._priv).fromRed(), i = new t(r.toArray()), o = this.getPrime();
            if (i.length < o.length) {
                var a = new t(o.length - i.length);
                a.fill(0), i = t.concat([ a, i ]);
            }
            return i;
        }, b.prototype.getPublicKey = function(e) {
            return m(this._pub, e);
        }, b.prototype.getPrivateKey = function(e) {
            return m(this._priv, e);
        }, b.prototype.getPrime = function(e) {
            return m(this.__prime, e);
        }, b.prototype.getGenerator = function(e) {
            return m(this._gen, e);
        }, b.prototype.setGenerator = function(e, r) {
            return r = r || "utf8", t.isBuffer(e) || (e = new t(e, r)), this.__gen = e, this._gen = new n(e), 
            this;
        };
    }).call(this, r(12).Buffer);
}, function(e, t, r) {
    (function(t) {
        var n = r(16), i = r(20), o = r(17), a = r(104), s = r(157), f = r(58);
        function c(e) {
            i.Writable.call(this);
            var t = f[e];
            if (!t) throw new Error("Unknown message digest");
            this._hashType = t.hash, this._hash = n(t.hash), this._tag = t.id, this._signType = t.sign;
        }
        function u(e) {
            i.Writable.call(this);
            var t = f[e];
            if (!t) throw new Error("Unknown message digest");
            this._hash = n(t.hash), this._tag = t.id, this._signType = t.sign;
        }
        function d(e) {
            return new c(e);
        }
        function h(e) {
            return new u(e);
        }
        Object.keys(f).forEach((function(e) {
            f[e].id = new t(f[e].id, "hex"), f[e.toLowerCase()] = f[e];
        })), o(c, i.Writable), c.prototype._write = function(e, t, r) {
            this._hash.update(e), r();
        }, c.prototype.update = function(e, r) {
            return "string" == typeof e && (e = new t(e, r)), this._hash.update(e), this;
        }, c.prototype.sign = function(e, t) {
            this.end();
            var r = this._hash.digest(), n = a(r, e, this._hashType, this._signType, this._tag);
            return t ? n.toString(t) : n;
        }, o(u, i.Writable), u.prototype._write = function(e, t, r) {
            this._hash.update(e), r();
        }, u.prototype.update = function(e, r) {
            return "string" == typeof e && (e = new t(e, r)), this._hash.update(e), this;
        }, u.prototype.verify = function(e, r, n) {
            "string" == typeof r && (r = new t(r, n)), this.end();
            var i = this._hash.digest();
            return s(r, i, e, this._signType, this._tag);
        }, e.exports = {
            Sign: d,
            Verify: h,
            createSign: d,
            createVerify: h
        };
    }).call(this, r(12).Buffer);
}, function(e, t, r) {
    (function(t) {
        var n = r(54), i = r(105), o = r(106).ec, a = r(95), s = r(136), f = r(156);
        function c(e, r, i, o) {
            if ((e = new t(e.toArray())).length < r.byteLength()) {
                var a = new t(r.byteLength() - e.length);
                a.fill(0), e = t.concat([ a, e ]);
            }
            var s = i.length, f = function(e, r) {
                e = (e = u(e, r)).mod(r);
                var n = new t(e.toArray());
                if (n.length < r.byteLength()) {
                    var i = new t(r.byteLength() - n.length);
                    i.fill(0), n = t.concat([ i, n ]);
                }
                return n;
            }(i, r), c = new t(s);
            c.fill(1);
            var d = new t(s);
            return d.fill(0), d = n(o, d).update(c).update(new t([ 0 ])).update(e).update(f).digest(), 
            c = n(o, d).update(c).digest(), {
                k: d = n(o, d).update(c).update(new t([ 1 ])).update(e).update(f).digest(),
                v: c = n(o, d).update(c).digest()
            };
        }
        function u(e, t) {
            var r = new a(e), n = (e.length << 3) - t.bitLength();
            return n > 0 && r.ishrn(n), r;
        }
        function d(e, r, i) {
            var o, a;
            do {
                for (o = new t(0); 8 * o.length < e.bitLength(); ) r.v = n(i, r.k).update(r.v).digest(), 
                o = t.concat([ o, r.v ]);
                a = u(o, e), r.k = n(i, r.k).update(r.v).update(new t([ 0 ])).digest(), r.v = n(i, r.k).update(r.v).digest();
            } while (-1 !== a.cmp(e));
            return a;
        }
        function h(e, t, r, n) {
            return e.toRed(a.mont(r)).redPow(t).fromRed().mod(n);
        }
        e.exports = function(e, r, n, l, p) {
            var b = s(r);
            if (b.curve) {
                if ("ecdsa" !== l && "ecdsa/rsa" !== l) throw new Error("wrong private key type");
                return function(e, r) {
                    var n = f[r.curve.join(".")];
                    if (!n) throw new Error("unknown curve " + r.curve.join("."));
                    var i = new o(n).keyFromPrivate(r.privateKey).sign(e);
                    return new t(i.toDER());
                }(e, b);
            }
            if ("dsa" === b.type) {
                if ("dsa" !== l) throw new Error("wrong private key type");
                return function(e, r, n) {
                    var i, o = r.params.priv_key, s = r.params.p, f = r.params.q, l = r.params.g, p = new a(0), b = u(e, f).mod(f), m = !1, g = c(o, f, e, n);
                    for (;!1 === m; ) i = d(f, g, n), p = h(l, i, s, f), 0 === (m = i.invm(f).imul(b.add(o.mul(p))).mod(f)).cmpn(0) && (m = !1, 
                    p = new a(0));
                    return function(e, r) {
                        e = e.toArray(), r = r.toArray(), 128 & e[0] && (e = [ 0 ].concat(e));
                        128 & r[0] && (r = [ 0 ].concat(r));
                        var n = [ 48, e.length + r.length + 4, 2, e.length ];
                        return n = n.concat(e, [ 2, r.length ], r), new t(n);
                    }(p, m);
                }(e, b, n);
            }
            if ("rsa" !== l && "ecdsa/rsa" !== l) throw new Error("wrong private key type");
            e = t.concat([ p, e ]);
            for (var m = b.modulus.byteLength(), g = [ 0, 1 ]; e.length + g.length + 1 < m; ) g.push(255);
            g.push(0);
            for (var y = -1; ++y < e.length; ) g.push(e[y]);
            return i(g, b);
        }, e.exports.getKey = c, e.exports.makeKey = d;
    }).call(this, r(12).Buffer);
}, function(e, t, r) {
    (function(t) {
        var n = r(95), i = r(9);
        function o(e, r) {
            var i = function(e) {
                var t = a(e);
                return {
                    blinder: t.toRed(n.mont(e.modulus)).redPow(new n(e.publicExponent)).fromRed(),
                    unblinder: t.invm(e.modulus)
                };
            }(r), o = r.modulus.byteLength(), s = (n.mont(r.modulus), new n(e).mul(i.blinder).umod(r.modulus)), f = s.toRed(n.mont(r.prime1)), c = s.toRed(n.mont(r.prime2)), u = r.coefficient, d = r.prime1, h = r.prime2, l = f.redPow(r.exponent1), p = c.redPow(r.exponent2);
            l = l.fromRed(), p = p.fromRed();
            var b = l.isub(p).imul(u).umod(d);
            return b.imul(h), p.iadd(b), new t(p.imul(i.unblinder).umod(r.modulus).toArray(!1, o));
        }
        function a(e) {
            for (var t = e.modulus.byteLength(), r = new n(i(t)); r.cmp(e.modulus) >= 0 || !r.umod(e.prime1) || !r.umod(e.prime2); ) r = new n(i(t));
            return r;
        }
        e.exports = o, o.getr = a;
    }).call(this, r(12).Buffer);
}, function(e, t, r) {
    "use strict";
    var n = t;
    n.version = r(107).version, n.utils = r(108), n.rand = r(99), n.curve = r(110), 
    n.curves = r(115), n.ec = r(129), n.eddsa = r(133);
}, function(e) {
    e.exports = JSON.parse('{"name":"elliptic","version":"6.5.2","description":"EC cryptography","main":"lib/elliptic.js","files":["lib"],"scripts":{"jscs":"jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js","jshint":"jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js","lint":"npm run jscs && npm run jshint","unit":"istanbul test _mocha --reporter=spec test/index.js","test":"npm run lint && npm run unit","version":"grunt dist && git add dist/"},"repository":{"type":"git","url":"git@github.com:indutny/elliptic"},"keywords":["EC","Elliptic","curve","Cryptography"],"author":"Fedor Indutny <fedor@indutny.com>","license":"MIT","bugs":{"url":"https://github.com/indutny/elliptic/issues"},"homepage":"https://github.com/indutny/elliptic","devDependencies":{"brfs":"^1.4.3","coveralls":"^3.0.8","grunt":"^1.0.4","grunt-browserify":"^5.0.0","grunt-cli":"^1.2.0","grunt-contrib-connect":"^1.0.0","grunt-contrib-copy":"^1.0.0","grunt-contrib-uglify":"^1.0.1","grunt-mocha-istanbul":"^3.0.1","grunt-saucelabs":"^9.0.1","istanbul":"^0.4.2","jscs":"^3.0.7","jshint":"^2.10.3","mocha":"^6.2.2"},"dependencies":{"bn.js":"^4.4.0","brorand":"^1.0.1","hash.js":"^1.0.0","hmac-drbg":"^1.0.0","inherits":"^2.0.1","minimalistic-assert":"^1.0.0","minimalistic-crypto-utils":"^1.0.0"}}');
}, function(e, t, r) {
    "use strict";
    var n = t, i = r(95), o = r(69), a = r(109);
    n.assert = o, n.toArray = a.toArray, n.zero2 = a.zero2, n.toHex = a.toHex, n.encode = a.encode, 
    n.getNAF = function(e, t, r) {
        var n = new Array(Math.max(e.bitLength(), r) + 1);
        n.fill(0);
        for (var i = 1 << t + 1, o = e.clone(), a = 0; a < n.length; a++) {
            var s, f = o.andln(i - 1);
            o.isOdd() ? (s = f > (i >> 1) - 1 ? (i >> 1) - f : f, o.isubn(s)) : s = 0, n[a] = s, 
            o.iushrn(1);
        }
        return n;
    }, n.getJSF = function(e, t) {
        var r = [ [], [] ];
        e = e.clone(), t = t.clone();
        for (var n = 0, i = 0; e.cmpn(-n) > 0 || t.cmpn(-i) > 0; ) {
            var o, a, s, f = e.andln(3) + n & 3, c = t.andln(3) + i & 3;
            if (3 === f && (f = -1), 3 === c && (c = -1), 0 == (1 & f)) o = 0; else o = 3 !== (s = e.andln(7) + n & 7) && 5 !== s || 2 !== c ? f : -f;
            if (r[0].push(o), 0 == (1 & c)) a = 0; else a = 3 !== (s = t.andln(7) + i & 7) && 5 !== s || 2 !== f ? c : -c;
            r[1].push(a), 2 * n === o + 1 && (n = 1 - n), 2 * i === a + 1 && (i = 1 - i), e.iushrn(1), 
            t.iushrn(1);
        }
        return r;
    }, n.cachedProperty = function(e, t, r) {
        var n = "_" + t;
        e.prototype[t] = function() {
            return void 0 !== this[n] ? this[n] : this[n] = r.call(this);
        };
    }, n.parseBytes = function(e) {
        return "string" == typeof e ? n.toArray(e, "hex") : e;
    }, n.intFromLE = function(e) {
        return new i(e, "hex", "le");
    };
}, function(e, t, r) {
    "use strict";
    var n = t;
    function i(e) {
        return 1 === e.length ? "0" + e : e;
    }
    function o(e) {
        for (var t = "", r = 0; r < e.length; r++) t += i(e[r].toString(16));
        return t;
    }
    n.toArray = function(e, t) {
        if (Array.isArray(e)) return e.slice();
        if (!e) return [];
        var r = [];
        if ("string" != typeof e) {
            for (var n = 0; n < e.length; n++) r[n] = 0 | e[n];
            return r;
        }
        if ("hex" === t) {
            (e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e = "0" + e);
            for (n = 0; n < e.length; n += 2) r.push(parseInt(e[n] + e[n + 1], 16));
        } else for (n = 0; n < e.length; n++) {
            var i = e.charCodeAt(n), o = i >> 8, a = 255 & i;
            o ? r.push(o, a) : r.push(a);
        }
        return r;
    }, n.zero2 = i, n.toHex = o, n.encode = function(e, t) {
        return "hex" === t ? o(e) : e;
    };
}, function(e, t, r) {
    "use strict";
    var n = t;
    n.base = r(111), n.short = r(112), n.mont = r(113), n.edwards = r(114);
}, function(e, t, r) {
    "use strict";
    var n = r(95), i = r(108), o = i.getNAF, a = i.getJSF, s = i.assert;
    function f(e, t) {
        this.type = e, this.p = new n(t.p, 16), this.red = t.prime ? n.red(t.prime) : n.mont(this.p), 
        this.zero = new n(0).toRed(this.red), this.one = new n(1).toRed(this.red), this.two = new n(2).toRed(this.red), 
        this.n = t.n && new n(t.n, 16), this.g = t.g && this.pointFromJSON(t.g, t.gRed), 
        this._wnafT1 = new Array(4), this._wnafT2 = new Array(4), this._wnafT3 = new Array(4), 
        this._wnafT4 = new Array(4), this._bitLength = this.n ? this.n.bitLength() : 0;
        var r = this.n && this.p.div(this.n);
        !r || r.cmpn(100) > 0 ? this.redN = null : (this._maxwellTrick = !0, this.redN = this.n.toRed(this.red));
    }
    function c(e, t) {
        this.curve = e, this.type = t, this.precomputed = null;
    }
    e.exports = f, f.prototype.point = function() {
        throw new Error("Not implemented");
    }, f.prototype.validate = function() {
        throw new Error("Not implemented");
    }, f.prototype._fixedNafMul = function(e, t) {
        s(e.precomputed);
        var r = e._getDoubles(), n = o(t, 1, this._bitLength), i = (1 << r.step + 1) - (r.step % 2 == 0 ? 2 : 1);
        i /= 3;
        for (var a = [], f = 0; f < n.length; f += r.step) {
            var c = 0;
            for (t = f + r.step - 1; t >= f; t--) c = (c << 1) + n[t];
            a.push(c);
        }
        for (var u = this.jpoint(null, null, null), d = this.jpoint(null, null, null), h = i; h > 0; h--) {
            for (f = 0; f < a.length; f++) {
                (c = a[f]) === h ? d = d.mixedAdd(r.points[f]) : c === -h && (d = d.mixedAdd(r.points[f].neg()));
            }
            u = u.add(d);
        }
        return u.toP();
    }, f.prototype._wnafMul = function(e, t) {
        var r = 4, n = e._getNAFPoints(r);
        r = n.wnd;
        for (var i = n.points, a = o(t, r, this._bitLength), f = this.jpoint(null, null, null), c = a.length - 1; c >= 0; c--) {
            for (t = 0; c >= 0 && 0 === a[c]; c--) t++;
            if (c >= 0 && t++, f = f.dblp(t), c < 0) break;
            var u = a[c];
            s(0 !== u), f = "affine" === e.type ? u > 0 ? f.mixedAdd(i[u - 1 >> 1]) : f.mixedAdd(i[-u - 1 >> 1].neg()) : u > 0 ? f.add(i[u - 1 >> 1]) : f.add(i[-u - 1 >> 1].neg());
        }
        return "affine" === e.type ? f.toP() : f;
    }, f.prototype._wnafMulAdd = function(e, t, r, n, i) {
        for (var s = this._wnafT1, f = this._wnafT2, c = this._wnafT3, u = 0, d = 0; d < n; d++) {
            var h = (E = t[d])._getNAFPoints(e);
            s[d] = h.wnd, f[d] = h.points;
        }
        for (d = n - 1; d >= 1; d -= 2) {
            var l = d - 1, p = d;
            if (1 === s[l] && 1 === s[p]) {
                var b = [ t[l], null, null, t[p] ];
                0 === t[l].y.cmp(t[p].y) ? (b[1] = t[l].add(t[p]), b[2] = t[l].toJ().mixedAdd(t[p].neg())) : 0 === t[l].y.cmp(t[p].y.redNeg()) ? (b[1] = t[l].toJ().mixedAdd(t[p]), 
                b[2] = t[l].add(t[p].neg())) : (b[1] = t[l].toJ().mixedAdd(t[p]), b[2] = t[l].toJ().mixedAdd(t[p].neg()));
                var m = [ -3, -1, -5, -7, 0, 7, 5, 1, 3 ], g = a(r[l], r[p]);
                u = Math.max(g[0].length, u), c[l] = new Array(u), c[p] = new Array(u);
                for (var y = 0; y < u; y++) {
                    var v = 0 | g[0][y], w = 0 | g[1][y];
                    c[l][y] = m[3 * (v + 1) + (w + 1)], c[p][y] = 0, f[l] = b;
                }
            } else c[l] = o(r[l], s[l], this._bitLength), c[p] = o(r[p], s[p], this._bitLength), 
            u = Math.max(c[l].length, u), u = Math.max(c[p].length, u);
        }
        var _ = this.jpoint(null, null, null), x = this._wnafT4;
        for (d = u; d >= 0; d--) {
            for (var S = 0; d >= 0; ) {
                var A = !0;
                for (y = 0; y < n; y++) x[y] = 0 | c[y][d], 0 !== x[y] && (A = !1);
                if (!A) break;
                S++, d--;
            }
            if (d >= 0 && S++, _ = _.dblp(S), d < 0) break;
            for (y = 0; y < n; y++) {
                var E, M = x[y];
                0 !== M && (M > 0 ? E = f[y][M - 1 >> 1] : M < 0 && (E = f[y][-M - 1 >> 1].neg()), 
                _ = "affine" === E.type ? _.mixedAdd(E) : _.add(E));
            }
        }
        for (d = 0; d < n; d++) f[d] = null;
        return i ? _ : _.toP();
    }, f.BasePoint = c, c.prototype.eq = function() {
        throw new Error("Not implemented");
    }, c.prototype.validate = function() {
        return this.curve.validate(this);
    }, f.prototype.decodePoint = function(e, t) {
        e = i.toArray(e, t);
        var r = this.p.byteLength();
        if ((4 === e[0] || 6 === e[0] || 7 === e[0]) && e.length - 1 == 2 * r) return 6 === e[0] ? s(e[e.length - 1] % 2 == 0) : 7 === e[0] && s(e[e.length - 1] % 2 == 1), 
        this.point(e.slice(1, 1 + r), e.slice(1 + r, 1 + 2 * r));
        if ((2 === e[0] || 3 === e[0]) && e.length - 1 === r) return this.pointFromX(e.slice(1, 1 + r), 3 === e[0]);
        throw new Error("Unknown point format");
    }, c.prototype.encodeCompressed = function(e) {
        return this.encode(e, !0);
    }, c.prototype._encode = function(e) {
        var t = this.curve.p.byteLength(), r = this.getX().toArray("be", t);
        return e ? [ this.getY().isEven() ? 2 : 3 ].concat(r) : [ 4 ].concat(r, this.getY().toArray("be", t));
    }, c.prototype.encode = function(e, t) {
        return i.encode(this._encode(t), e);
    }, c.prototype.precompute = function(e) {
        if (this.precomputed) return this;
        var t = {
            doubles: null,
            naf: null,
            beta: null
        };
        return t.naf = this._getNAFPoints(8), t.doubles = this._getDoubles(4, e), t.beta = this._getBeta(), 
        this.precomputed = t, this;
    }, c.prototype._hasDoubles = function(e) {
        if (!this.precomputed) return !1;
        var t = this.precomputed.doubles;
        return !!t && t.points.length >= Math.ceil((e.bitLength() + 1) / t.step);
    }, c.prototype._getDoubles = function(e, t) {
        if (this.precomputed && this.precomputed.doubles) return this.precomputed.doubles;
        for (var r = [ this ], n = this, i = 0; i < t; i += e) {
            for (var o = 0; o < e; o++) n = n.dbl();
            r.push(n);
        }
        return {
            step: e,
            points: r
        };
    }, c.prototype._getNAFPoints = function(e) {
        if (this.precomputed && this.precomputed.naf) return this.precomputed.naf;
        for (var t = [ this ], r = (1 << e) - 1, n = 1 === r ? null : this.dbl(), i = 1; i < r; i++) t[i] = t[i - 1].add(n);
        return {
            wnd: e,
            points: t
        };
    }, c.prototype._getBeta = function() {
        return null;
    }, c.prototype.dblp = function(e) {
        for (var t = this, r = 0; r < e; r++) t = t.dbl();
        return t;
    };
}, function(e, t, r) {
    "use strict";
    var n = r(108), i = r(95), o = r(17), a = r(111), s = n.assert;
    function f(e) {
        a.call(this, "short", e), this.a = new i(e.a, 16).toRed(this.red), this.b = new i(e.b, 16).toRed(this.red), 
        this.tinv = this.two.redInvm(), this.zeroA = 0 === this.a.fromRed().cmpn(0), this.threeA = 0 === this.a.fromRed().sub(this.p).cmpn(-3), 
        this.endo = this._getEndomorphism(e), this._endoWnafT1 = new Array(4), this._endoWnafT2 = new Array(4);
    }
    function c(e, t, r, n) {
        a.BasePoint.call(this, e, "affine"), null === t && null === r ? (this.x = null, 
        this.y = null, this.inf = !0) : (this.x = new i(t, 16), this.y = new i(r, 16), n && (this.x.forceRed(this.curve.red), 
        this.y.forceRed(this.curve.red)), this.x.red || (this.x = this.x.toRed(this.curve.red)), 
        this.y.red || (this.y = this.y.toRed(this.curve.red)), this.inf = !1);
    }
    function u(e, t, r, n) {
        a.BasePoint.call(this, e, "jacobian"), null === t && null === r && null === n ? (this.x = this.curve.one, 
        this.y = this.curve.one, this.z = new i(0)) : (this.x = new i(t, 16), this.y = new i(r, 16), 
        this.z = new i(n, 16)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), 
        this.z.red || (this.z = this.z.toRed(this.curve.red)), this.zOne = this.z === this.curve.one;
    }
    o(f, a), e.exports = f, f.prototype._getEndomorphism = function(e) {
        if (this.zeroA && this.g && this.n && 1 === this.p.modn(3)) {
            var t, r;
            if (e.beta) t = new i(e.beta, 16).toRed(this.red); else {
                var n = this._getEndoRoots(this.p);
                t = (t = n[0].cmp(n[1]) < 0 ? n[0] : n[1]).toRed(this.red);
            }
            if (e.lambda) r = new i(e.lambda, 16); else {
                var o = this._getEndoRoots(this.n);
                0 === this.g.mul(o[0]).x.cmp(this.g.x.redMul(t)) ? r = o[0] : (r = o[1], s(0 === this.g.mul(r).x.cmp(this.g.x.redMul(t))));
            }
            return {
                beta: t,
                lambda: r,
                basis: e.basis ? e.basis.map((function(e) {
                    return {
                        a: new i(e.a, 16),
                        b: new i(e.b, 16)
                    };
                })) : this._getEndoBasis(r)
            };
        }
    }, f.prototype._getEndoRoots = function(e) {
        var t = e === this.p ? this.red : i.mont(e), r = new i(2).toRed(t).redInvm(), n = r.redNeg(), o = new i(3).toRed(t).redNeg().redSqrt().redMul(r);
        return [ n.redAdd(o).fromRed(), n.redSub(o).fromRed() ];
    }, f.prototype._getEndoBasis = function(e) {
        for (var t, r, n, o, a, s, f, c, u, d = this.n.ushrn(Math.floor(this.n.bitLength() / 2)), h = e, l = this.n.clone(), p = new i(1), b = new i(0), m = new i(0), g = new i(1), y = 0; 0 !== h.cmpn(0); ) {
            var v = l.div(h);
            c = l.sub(v.mul(h)), u = m.sub(v.mul(p));
            var w = g.sub(v.mul(b));
            if (!n && c.cmp(d) < 0) t = f.neg(), r = p, n = c.neg(), o = u; else if (n && 2 == ++y) break;
            f = c, l = h, h = c, m = p, p = u, g = b, b = w;
        }
        a = c.neg(), s = u;
        var _ = n.sqr().add(o.sqr());
        return a.sqr().add(s.sqr()).cmp(_) >= 0 && (a = t, s = r), n.negative && (n = n.neg(), 
        o = o.neg()), a.negative && (a = a.neg(), s = s.neg()), [ {
            a: n,
            b: o
        }, {
            a: a,
            b: s
        } ];
    }, f.prototype._endoSplit = function(e) {
        var t = this.endo.basis, r = t[0], n = t[1], i = n.b.mul(e).divRound(this.n), o = r.b.neg().mul(e).divRound(this.n), a = i.mul(r.a), s = o.mul(n.a), f = i.mul(r.b), c = o.mul(n.b);
        return {
            k1: e.sub(a).sub(s),
            k2: f.add(c).neg()
        };
    }, f.prototype.pointFromX = function(e, t) {
        (e = new i(e, 16)).red || (e = e.toRed(this.red));
        var r = e.redSqr().redMul(e).redIAdd(e.redMul(this.a)).redIAdd(this.b), n = r.redSqrt();
        if (0 !== n.redSqr().redSub(r).cmp(this.zero)) throw new Error("invalid point");
        var o = n.fromRed().isOdd();
        return (t && !o || !t && o) && (n = n.redNeg()), this.point(e, n);
    }, f.prototype.validate = function(e) {
        if (e.inf) return !0;
        var t = e.x, r = e.y, n = this.a.redMul(t), i = t.redSqr().redMul(t).redIAdd(n).redIAdd(this.b);
        return 0 === r.redSqr().redISub(i).cmpn(0);
    }, f.prototype._endoWnafMulAdd = function(e, t, r) {
        for (var n = this._endoWnafT1, i = this._endoWnafT2, o = 0; o < e.length; o++) {
            var a = this._endoSplit(t[o]), s = e[o], f = s._getBeta();
            a.k1.negative && (a.k1.ineg(), s = s.neg(!0)), a.k2.negative && (a.k2.ineg(), f = f.neg(!0)), 
            n[2 * o] = s, n[2 * o + 1] = f, i[2 * o] = a.k1, i[2 * o + 1] = a.k2;
        }
        for (var c = this._wnafMulAdd(1, n, i, 2 * o, r), u = 0; u < 2 * o; u++) n[u] = null, 
        i[u] = null;
        return c;
    }, o(c, a.BasePoint), f.prototype.point = function(e, t, r) {
        return new c(this, e, t, r);
    }, f.prototype.pointFromJSON = function(e, t) {
        return c.fromJSON(this, e, t);
    }, c.prototype._getBeta = function() {
        if (this.curve.endo) {
            var e = this.precomputed;
            if (e && e.beta) return e.beta;
            var t = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
            if (e) {
                var r = this.curve, n = function(e) {
                    return r.point(e.x.redMul(r.endo.beta), e.y);
                };
                e.beta = t, t.precomputed = {
                    beta: null,
                    naf: e.naf && {
                        wnd: e.naf.wnd,
                        points: e.naf.points.map(n)
                    },
                    doubles: e.doubles && {
                        step: e.doubles.step,
                        points: e.doubles.points.map(n)
                    }
                };
            }
            return t;
        }
    }, c.prototype.toJSON = function() {
        return this.precomputed ? [ this.x, this.y, this.precomputed && {
            doubles: this.precomputed.doubles && {
                step: this.precomputed.doubles.step,
                points: this.precomputed.doubles.points.slice(1)
            },
            naf: this.precomputed.naf && {
                wnd: this.precomputed.naf.wnd,
                points: this.precomputed.naf.points.slice(1)
            }
        } ] : [ this.x, this.y ];
    }, c.fromJSON = function(e, t, r) {
        "string" == typeof t && (t = JSON.parse(t));
        var n = e.point(t[0], t[1], r);
        if (!t[2]) return n;
        function i(t) {
            return e.point(t[0], t[1], r);
        }
        var o = t[2];
        return n.precomputed = {
            beta: null,
            doubles: o.doubles && {
                step: o.doubles.step,
                points: [ n ].concat(o.doubles.points.map(i))
            },
            naf: o.naf && {
                wnd: o.naf.wnd,
                points: [ n ].concat(o.naf.points.map(i))
            }
        }, n;
    }, c.prototype.inspect = function() {
        return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">";
    }, c.prototype.isInfinity = function() {
        return this.inf;
    }, c.prototype.add = function(e) {
        if (this.inf) return e;
        if (e.inf) return this;
        if (this.eq(e)) return this.dbl();
        if (this.neg().eq(e)) return this.curve.point(null, null);
        if (0 === this.x.cmp(e.x)) return this.curve.point(null, null);
        var t = this.y.redSub(e.y);
        0 !== t.cmpn(0) && (t = t.redMul(this.x.redSub(e.x).redInvm()));
        var r = t.redSqr().redISub(this.x).redISub(e.x), n = t.redMul(this.x.redSub(r)).redISub(this.y);
        return this.curve.point(r, n);
    }, c.prototype.dbl = function() {
        if (this.inf) return this;
        var e = this.y.redAdd(this.y);
        if (0 === e.cmpn(0)) return this.curve.point(null, null);
        var t = this.curve.a, r = this.x.redSqr(), n = e.redInvm(), i = r.redAdd(r).redIAdd(r).redIAdd(t).redMul(n), o = i.redSqr().redISub(this.x.redAdd(this.x)), a = i.redMul(this.x.redSub(o)).redISub(this.y);
        return this.curve.point(o, a);
    }, c.prototype.getX = function() {
        return this.x.fromRed();
    }, c.prototype.getY = function() {
        return this.y.fromRed();
    }, c.prototype.mul = function(e) {
        return e = new i(e, 16), this.isInfinity() ? this : this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve.endo ? this.curve._endoWnafMulAdd([ this ], [ e ]) : this.curve._wnafMul(this, e);
    }, c.prototype.mulAdd = function(e, t, r) {
        var n = [ this, t ], i = [ e, r ];
        return this.curve.endo ? this.curve._endoWnafMulAdd(n, i) : this.curve._wnafMulAdd(1, n, i, 2);
    }, c.prototype.jmulAdd = function(e, t, r) {
        var n = [ this, t ], i = [ e, r ];
        return this.curve.endo ? this.curve._endoWnafMulAdd(n, i, !0) : this.curve._wnafMulAdd(1, n, i, 2, !0);
    }, c.prototype.eq = function(e) {
        return this === e || this.inf === e.inf && (this.inf || 0 === this.x.cmp(e.x) && 0 === this.y.cmp(e.y));
    }, c.prototype.neg = function(e) {
        if (this.inf) return this;
        var t = this.curve.point(this.x, this.y.redNeg());
        if (e && this.precomputed) {
            var r = this.precomputed, n = function(e) {
                return e.neg();
            };
            t.precomputed = {
                naf: r.naf && {
                    wnd: r.naf.wnd,
                    points: r.naf.points.map(n)
                },
                doubles: r.doubles && {
                    step: r.doubles.step,
                    points: r.doubles.points.map(n)
                }
            };
        }
        return t;
    }, c.prototype.toJ = function() {
        return this.inf ? this.curve.jpoint(null, null, null) : this.curve.jpoint(this.x, this.y, this.curve.one);
    }, o(u, a.BasePoint), f.prototype.jpoint = function(e, t, r) {
        return new u(this, e, t, r);
    }, u.prototype.toP = function() {
        if (this.isInfinity()) return this.curve.point(null, null);
        var e = this.z.redInvm(), t = e.redSqr(), r = this.x.redMul(t), n = this.y.redMul(t).redMul(e);
        return this.curve.point(r, n);
    }, u.prototype.neg = function() {
        return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
    }, u.prototype.add = function(e) {
        if (this.isInfinity()) return e;
        if (e.isInfinity()) return this;
        var t = e.z.redSqr(), r = this.z.redSqr(), n = this.x.redMul(t), i = e.x.redMul(r), o = this.y.redMul(t.redMul(e.z)), a = e.y.redMul(r.redMul(this.z)), s = n.redSub(i), f = o.redSub(a);
        if (0 === s.cmpn(0)) return 0 !== f.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();
        var c = s.redSqr(), u = c.redMul(s), d = n.redMul(c), h = f.redSqr().redIAdd(u).redISub(d).redISub(d), l = f.redMul(d.redISub(h)).redISub(o.redMul(u)), p = this.z.redMul(e.z).redMul(s);
        return this.curve.jpoint(h, l, p);
    }, u.prototype.mixedAdd = function(e) {
        if (this.isInfinity()) return e.toJ();
        if (e.isInfinity()) return this;
        var t = this.z.redSqr(), r = this.x, n = e.x.redMul(t), i = this.y, o = e.y.redMul(t).redMul(this.z), a = r.redSub(n), s = i.redSub(o);
        if (0 === a.cmpn(0)) return 0 !== s.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();
        var f = a.redSqr(), c = f.redMul(a), u = r.redMul(f), d = s.redSqr().redIAdd(c).redISub(u).redISub(u), h = s.redMul(u.redISub(d)).redISub(i.redMul(c)), l = this.z.redMul(a);
        return this.curve.jpoint(d, h, l);
    }, u.prototype.dblp = function(e) {
        if (0 === e) return this;
        if (this.isInfinity()) return this;
        if (!e) return this.dbl();
        if (this.curve.zeroA || this.curve.threeA) {
            for (var t = this, r = 0; r < e; r++) t = t.dbl();
            return t;
        }
        var n = this.curve.a, i = this.curve.tinv, o = this.x, a = this.y, s = this.z, f = s.redSqr().redSqr(), c = a.redAdd(a);
        for (r = 0; r < e; r++) {
            var u = o.redSqr(), d = c.redSqr(), h = d.redSqr(), l = u.redAdd(u).redIAdd(u).redIAdd(n.redMul(f)), p = o.redMul(d), b = l.redSqr().redISub(p.redAdd(p)), m = p.redISub(b), g = l.redMul(m);
            g = g.redIAdd(g).redISub(h);
            var y = c.redMul(s);
            r + 1 < e && (f = f.redMul(h)), o = b, s = y, c = g;
        }
        return this.curve.jpoint(o, c.redMul(i), s);
    }, u.prototype.dbl = function() {
        return this.isInfinity() ? this : this.curve.zeroA ? this._zeroDbl() : this.curve.threeA ? this._threeDbl() : this._dbl();
    }, u.prototype._zeroDbl = function() {
        var e, t, r;
        if (this.zOne) {
            var n = this.x.redSqr(), i = this.y.redSqr(), o = i.redSqr(), a = this.x.redAdd(i).redSqr().redISub(n).redISub(o);
            a = a.redIAdd(a);
            var s = n.redAdd(n).redIAdd(n), f = s.redSqr().redISub(a).redISub(a), c = o.redIAdd(o);
            c = (c = c.redIAdd(c)).redIAdd(c), e = f, t = s.redMul(a.redISub(f)).redISub(c), 
            r = this.y.redAdd(this.y);
        } else {
            var u = this.x.redSqr(), d = this.y.redSqr(), h = d.redSqr(), l = this.x.redAdd(d).redSqr().redISub(u).redISub(h);
            l = l.redIAdd(l);
            var p = u.redAdd(u).redIAdd(u), b = p.redSqr(), m = h.redIAdd(h);
            m = (m = m.redIAdd(m)).redIAdd(m), e = b.redISub(l).redISub(l), t = p.redMul(l.redISub(e)).redISub(m), 
            r = (r = this.y.redMul(this.z)).redIAdd(r);
        }
        return this.curve.jpoint(e, t, r);
    }, u.prototype._threeDbl = function() {
        var e, t, r;
        if (this.zOne) {
            var n = this.x.redSqr(), i = this.y.redSqr(), o = i.redSqr(), a = this.x.redAdd(i).redSqr().redISub(n).redISub(o);
            a = a.redIAdd(a);
            var s = n.redAdd(n).redIAdd(n).redIAdd(this.curve.a), f = s.redSqr().redISub(a).redISub(a);
            e = f;
            var c = o.redIAdd(o);
            c = (c = c.redIAdd(c)).redIAdd(c), t = s.redMul(a.redISub(f)).redISub(c), r = this.y.redAdd(this.y);
        } else {
            var u = this.z.redSqr(), d = this.y.redSqr(), h = this.x.redMul(d), l = this.x.redSub(u).redMul(this.x.redAdd(u));
            l = l.redAdd(l).redIAdd(l);
            var p = h.redIAdd(h), b = (p = p.redIAdd(p)).redAdd(p);
            e = l.redSqr().redISub(b), r = this.y.redAdd(this.z).redSqr().redISub(d).redISub(u);
            var m = d.redSqr();
            m = (m = (m = m.redIAdd(m)).redIAdd(m)).redIAdd(m), t = l.redMul(p.redISub(e)).redISub(m);
        }
        return this.curve.jpoint(e, t, r);
    }, u.prototype._dbl = function() {
        var e = this.curve.a, t = this.x, r = this.y, n = this.z, i = n.redSqr().redSqr(), o = t.redSqr(), a = r.redSqr(), s = o.redAdd(o).redIAdd(o).redIAdd(e.redMul(i)), f = t.redAdd(t), c = (f = f.redIAdd(f)).redMul(a), u = s.redSqr().redISub(c.redAdd(c)), d = c.redISub(u), h = a.redSqr();
        h = (h = (h = h.redIAdd(h)).redIAdd(h)).redIAdd(h);
        var l = s.redMul(d).redISub(h), p = r.redAdd(r).redMul(n);
        return this.curve.jpoint(u, l, p);
    }, u.prototype.trpl = function() {
        if (!this.curve.zeroA) return this.dbl().add(this);
        var e = this.x.redSqr(), t = this.y.redSqr(), r = this.z.redSqr(), n = t.redSqr(), i = e.redAdd(e).redIAdd(e), o = i.redSqr(), a = this.x.redAdd(t).redSqr().redISub(e).redISub(n), s = (a = (a = (a = a.redIAdd(a)).redAdd(a).redIAdd(a)).redISub(o)).redSqr(), f = n.redIAdd(n);
        f = (f = (f = f.redIAdd(f)).redIAdd(f)).redIAdd(f);
        var c = i.redIAdd(a).redSqr().redISub(o).redISub(s).redISub(f), u = t.redMul(c);
        u = (u = u.redIAdd(u)).redIAdd(u);
        var d = this.x.redMul(s).redISub(u);
        d = (d = d.redIAdd(d)).redIAdd(d);
        var h = this.y.redMul(c.redMul(f.redISub(c)).redISub(a.redMul(s)));
        h = (h = (h = h.redIAdd(h)).redIAdd(h)).redIAdd(h);
        var l = this.z.redAdd(a).redSqr().redISub(r).redISub(s);
        return this.curve.jpoint(d, h, l);
    }, u.prototype.mul = function(e, t) {
        return e = new i(e, t), this.curve._wnafMul(this, e);
    }, u.prototype.eq = function(e) {
        if ("affine" === e.type) return this.eq(e.toJ());
        if (this === e) return !0;
        var t = this.z.redSqr(), r = e.z.redSqr();
        if (0 !== this.x.redMul(r).redISub(e.x.redMul(t)).cmpn(0)) return !1;
        var n = t.redMul(this.z), i = r.redMul(e.z);
        return 0 === this.y.redMul(i).redISub(e.y.redMul(n)).cmpn(0);
    }, u.prototype.eqXToP = function(e) {
        var t = this.z.redSqr(), r = e.toRed(this.curve.red).redMul(t);
        if (0 === this.x.cmp(r)) return !0;
        for (var n = e.clone(), i = this.curve.redN.redMul(t); ;) {
            if (n.iadd(this.curve.n), n.cmp(this.curve.p) >= 0) return !1;
            if (r.redIAdd(i), 0 === this.x.cmp(r)) return !0;
        }
    }, u.prototype.inspect = function() {
        return this.isInfinity() ? "<EC JPoint Infinity>" : "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">";
    }, u.prototype.isInfinity = function() {
        return 0 === this.z.cmpn(0);
    };
}, function(e, t, r) {
    "use strict";
    var n = r(95), i = r(17), o = r(111), a = r(108);
    function s(e) {
        o.call(this, "mont", e), this.a = new n(e.a, 16).toRed(this.red), this.b = new n(e.b, 16).toRed(this.red), 
        this.i4 = new n(4).toRed(this.red).redInvm(), this.two = new n(2).toRed(this.red), 
        this.a24 = this.i4.redMul(this.a.redAdd(this.two));
    }
    function f(e, t, r) {
        o.BasePoint.call(this, e, "projective"), null === t && null === r ? (this.x = this.curve.one, 
        this.z = this.curve.zero) : (this.x = new n(t, 16), this.z = new n(r, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), 
        this.z.red || (this.z = this.z.toRed(this.curve.red)));
    }
    i(s, o), e.exports = s, s.prototype.validate = function(e) {
        var t = e.normalize().x, r = t.redSqr(), n = r.redMul(t).redAdd(r.redMul(this.a)).redAdd(t);
        return 0 === n.redSqrt().redSqr().cmp(n);
    }, i(f, o.BasePoint), s.prototype.decodePoint = function(e, t) {
        return this.point(a.toArray(e, t), 1);
    }, s.prototype.point = function(e, t) {
        return new f(this, e, t);
    }, s.prototype.pointFromJSON = function(e) {
        return f.fromJSON(this, e);
    }, f.prototype.precompute = function() {}, f.prototype._encode = function() {
        return this.getX().toArray("be", this.curve.p.byteLength());
    }, f.fromJSON = function(e, t) {
        return new f(e, t[0], t[1] || e.one);
    }, f.prototype.inspect = function() {
        return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
    }, f.prototype.isInfinity = function() {
        return 0 === this.z.cmpn(0);
    }, f.prototype.dbl = function() {
        var e = this.x.redAdd(this.z).redSqr(), t = this.x.redSub(this.z).redSqr(), r = e.redSub(t), n = e.redMul(t), i = r.redMul(t.redAdd(this.curve.a24.redMul(r)));
        return this.curve.point(n, i);
    }, f.prototype.add = function() {
        throw new Error("Not supported on Montgomery curve");
    }, f.prototype.diffAdd = function(e, t) {
        var r = this.x.redAdd(this.z), n = this.x.redSub(this.z), i = e.x.redAdd(e.z), o = e.x.redSub(e.z).redMul(r), a = i.redMul(n), s = t.z.redMul(o.redAdd(a).redSqr()), f = t.x.redMul(o.redISub(a).redSqr());
        return this.curve.point(s, f);
    }, f.prototype.mul = function(e) {
        for (var t = e.clone(), r = this, n = this.curve.point(null, null), i = []; 0 !== t.cmpn(0); t.iushrn(1)) i.push(t.andln(1));
        for (var o = i.length - 1; o >= 0; o--) 0 === i[o] ? (r = r.diffAdd(n, this), n = n.dbl()) : (n = r.diffAdd(n, this), 
        r = r.dbl());
        return n;
    }, f.prototype.mulAdd = function() {
        throw new Error("Not supported on Montgomery curve");
    }, f.prototype.jumlAdd = function() {
        throw new Error("Not supported on Montgomery curve");
    }, f.prototype.eq = function(e) {
        return 0 === this.getX().cmp(e.getX());
    }, f.prototype.normalize = function() {
        return this.x = this.x.redMul(this.z.redInvm()), this.z = this.curve.one, this;
    }, f.prototype.getX = function() {
        return this.normalize(), this.x.fromRed();
    };
}, function(e, t, r) {
    "use strict";
    var n = r(108), i = r(95), o = r(17), a = r(111), s = n.assert;
    function f(e) {
        this.twisted = 1 != (0 | e.a), this.mOneA = this.twisted && -1 == (0 | e.a), this.extended = this.mOneA, 
        a.call(this, "edwards", e), this.a = new i(e.a, 16).umod(this.red.m), this.a = this.a.toRed(this.red), 
        this.c = new i(e.c, 16).toRed(this.red), this.c2 = this.c.redSqr(), this.d = new i(e.d, 16).toRed(this.red), 
        this.dd = this.d.redAdd(this.d), s(!this.twisted || 0 === this.c.fromRed().cmpn(1)), 
        this.oneC = 1 == (0 | e.c);
    }
    function c(e, t, r, n, o) {
        a.BasePoint.call(this, e, "projective"), null === t && null === r && null === n ? (this.x = this.curve.zero, 
        this.y = this.curve.one, this.z = this.curve.one, this.t = this.curve.zero, this.zOne = !0) : (this.x = new i(t, 16), 
        this.y = new i(r, 16), this.z = n ? new i(n, 16) : this.curve.one, this.t = o && new i(o, 16), 
        this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), 
        this.z.red || (this.z = this.z.toRed(this.curve.red)), this.t && !this.t.red && (this.t = this.t.toRed(this.curve.red)), 
        this.zOne = this.z === this.curve.one, this.curve.extended && !this.t && (this.t = this.x.redMul(this.y), 
        this.zOne || (this.t = this.t.redMul(this.z.redInvm()))));
    }
    o(f, a), e.exports = f, f.prototype._mulA = function(e) {
        return this.mOneA ? e.redNeg() : this.a.redMul(e);
    }, f.prototype._mulC = function(e) {
        return this.oneC ? e : this.c.redMul(e);
    }, f.prototype.jpoint = function(e, t, r, n) {
        return this.point(e, t, r, n);
    }, f.prototype.pointFromX = function(e, t) {
        (e = new i(e, 16)).red || (e = e.toRed(this.red));
        var r = e.redSqr(), n = this.c2.redSub(this.a.redMul(r)), o = this.one.redSub(this.c2.redMul(this.d).redMul(r)), a = n.redMul(o.redInvm()), s = a.redSqrt();
        if (0 !== s.redSqr().redSub(a).cmp(this.zero)) throw new Error("invalid point");
        var f = s.fromRed().isOdd();
        return (t && !f || !t && f) && (s = s.redNeg()), this.point(e, s);
    }, f.prototype.pointFromY = function(e, t) {
        (e = new i(e, 16)).red || (e = e.toRed(this.red));
        var r = e.redSqr(), n = r.redSub(this.c2), o = r.redMul(this.d).redMul(this.c2).redSub(this.a), a = n.redMul(o.redInvm());
        if (0 === a.cmp(this.zero)) {
            if (t) throw new Error("invalid point");
            return this.point(this.zero, e);
        }
        var s = a.redSqrt();
        if (0 !== s.redSqr().redSub(a).cmp(this.zero)) throw new Error("invalid point");
        return s.fromRed().isOdd() !== t && (s = s.redNeg()), this.point(s, e);
    }, f.prototype.validate = function(e) {
        if (e.isInfinity()) return !0;
        e.normalize();
        var t = e.x.redSqr(), r = e.y.redSqr(), n = t.redMul(this.a).redAdd(r), i = this.c2.redMul(this.one.redAdd(this.d.redMul(t).redMul(r)));
        return 0 === n.cmp(i);
    }, o(c, a.BasePoint), f.prototype.pointFromJSON = function(e) {
        return c.fromJSON(this, e);
    }, f.prototype.point = function(e, t, r, n) {
        return new c(this, e, t, r, n);
    }, c.fromJSON = function(e, t) {
        return new c(e, t[0], t[1], t[2]);
    }, c.prototype.inspect = function() {
        return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
    }, c.prototype.isInfinity = function() {
        return 0 === this.x.cmpn(0) && (0 === this.y.cmp(this.z) || this.zOne && 0 === this.y.cmp(this.curve.c));
    }, c.prototype._extDbl = function() {
        var e = this.x.redSqr(), t = this.y.redSqr(), r = this.z.redSqr();
        r = r.redIAdd(r);
        var n = this.curve._mulA(e), i = this.x.redAdd(this.y).redSqr().redISub(e).redISub(t), o = n.redAdd(t), a = o.redSub(r), s = n.redSub(t), f = i.redMul(a), c = o.redMul(s), u = i.redMul(s), d = a.redMul(o);
        return this.curve.point(f, c, d, u);
    }, c.prototype._projDbl = function() {
        var e, t, r, n = this.x.redAdd(this.y).redSqr(), i = this.x.redSqr(), o = this.y.redSqr();
        if (this.curve.twisted) {
            var a = (c = this.curve._mulA(i)).redAdd(o);
            if (this.zOne) e = n.redSub(i).redSub(o).redMul(a.redSub(this.curve.two)), t = a.redMul(c.redSub(o)), 
            r = a.redSqr().redSub(a).redSub(a); else {
                var s = this.z.redSqr(), f = a.redSub(s).redISub(s);
                e = n.redSub(i).redISub(o).redMul(f), t = a.redMul(c.redSub(o)), r = a.redMul(f);
            }
        } else {
            var c = i.redAdd(o);
            s = this.curve._mulC(this.z).redSqr(), f = c.redSub(s).redSub(s);
            e = this.curve._mulC(n.redISub(c)).redMul(f), t = this.curve._mulC(c).redMul(i.redISub(o)), 
            r = c.redMul(f);
        }
        return this.curve.point(e, t, r);
    }, c.prototype.dbl = function() {
        return this.isInfinity() ? this : this.curve.extended ? this._extDbl() : this._projDbl();
    }, c.prototype._extAdd = function(e) {
        var t = this.y.redSub(this.x).redMul(e.y.redSub(e.x)), r = this.y.redAdd(this.x).redMul(e.y.redAdd(e.x)), n = this.t.redMul(this.curve.dd).redMul(e.t), i = this.z.redMul(e.z.redAdd(e.z)), o = r.redSub(t), a = i.redSub(n), s = i.redAdd(n), f = r.redAdd(t), c = o.redMul(a), u = s.redMul(f), d = o.redMul(f), h = a.redMul(s);
        return this.curve.point(c, u, h, d);
    }, c.prototype._projAdd = function(e) {
        var t, r, n = this.z.redMul(e.z), i = n.redSqr(), o = this.x.redMul(e.x), a = this.y.redMul(e.y), s = this.curve.d.redMul(o).redMul(a), f = i.redSub(s), c = i.redAdd(s), u = this.x.redAdd(this.y).redMul(e.x.redAdd(e.y)).redISub(o).redISub(a), d = n.redMul(f).redMul(u);
        return this.curve.twisted ? (t = n.redMul(c).redMul(a.redSub(this.curve._mulA(o))), 
        r = f.redMul(c)) : (t = n.redMul(c).redMul(a.redSub(o)), r = this.curve._mulC(f).redMul(c)), 
        this.curve.point(d, t, r);
    }, c.prototype.add = function(e) {
        return this.isInfinity() ? e : e.isInfinity() ? this : this.curve.extended ? this._extAdd(e) : this._projAdd(e);
    }, c.prototype.mul = function(e) {
        return this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve._wnafMul(this, e);
    }, c.prototype.mulAdd = function(e, t, r) {
        return this.curve._wnafMulAdd(1, [ this, t ], [ e, r ], 2, !1);
    }, c.prototype.jmulAdd = function(e, t, r) {
        return this.curve._wnafMulAdd(1, [ this, t ], [ e, r ], 2, !0);
    }, c.prototype.normalize = function() {
        if (this.zOne) return this;
        var e = this.z.redInvm();
        return this.x = this.x.redMul(e), this.y = this.y.redMul(e), this.t && (this.t = this.t.redMul(e)), 
        this.z = this.curve.one, this.zOne = !0, this;
    }, c.prototype.neg = function() {
        return this.curve.point(this.x.redNeg(), this.y, this.z, this.t && this.t.redNeg());
    }, c.prototype.getX = function() {
        return this.normalize(), this.x.fromRed();
    }, c.prototype.getY = function() {
        return this.normalize(), this.y.fromRed();
    }, c.prototype.eq = function(e) {
        return this === e || 0 === this.getX().cmp(e.getX()) && 0 === this.getY().cmp(e.getY());
    }, c.prototype.eqXToP = function(e) {
        var t = e.toRed(this.curve.red).redMul(this.z);
        if (0 === this.x.cmp(t)) return !0;
        for (var r = e.clone(), n = this.curve.redN.redMul(this.z); ;) {
            if (r.iadd(this.curve.n), r.cmp(this.curve.p) >= 0) return !1;
            if (t.redIAdd(n), 0 === this.x.cmp(t)) return !0;
        }
    }, c.prototype.toP = c.prototype.normalize, c.prototype.mixedAdd = c.prototype.add;
}, function(e, t, r) {
    "use strict";
    var n, i = t, o = r(116), a = r(110), s = r(108).assert;
    function f(e) {
        "short" === e.type ? this.curve = new a.short(e) : "edwards" === e.type ? this.curve = new a.edwards(e) : this.curve = new a.mont(e), 
        this.g = this.curve.g, this.n = this.curve.n, this.hash = e.hash, s(this.g.validate(), "Invalid curve"), 
        s(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O");
    }
    function c(e, t) {
        Object.defineProperty(i, e, {
            configurable: !0,
            enumerable: !0,
            get: function() {
                var r = new f(t);
                return Object.defineProperty(i, e, {
                    configurable: !0,
                    enumerable: !0,
                    value: r
                }), r;
            }
        });
    }
    i.PresetCurve = f, c("p192", {
        type: "short",
        prime: "p192",
        p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
        a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
        b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
        n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
        hash: o.sha256,
        gRed: !1,
        g: [ "188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012", "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811" ]
    }), c("p224", {
        type: "short",
        prime: "p224",
        p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
        a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
        b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
        n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
        hash: o.sha256,
        gRed: !1,
        g: [ "b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21", "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34" ]
    }), c("p256", {
        type: "short",
        prime: null,
        p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
        a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
        b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
        n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
        hash: o.sha256,
        gRed: !1,
        g: [ "6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296", "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5" ]
    }), c("p384", {
        type: "short",
        prime: null,
        p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff",
        a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc",
        b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",
        n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",
        hash: o.sha384,
        gRed: !1,
        g: [ "aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7", "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f" ]
    }), c("p521", {
        type: "short",
        prime: null,
        p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff",
        a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc",
        b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",
        n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",
        hash: o.sha512,
        gRed: !1,
        g: [ "000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66", "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650" ]
    }), c("curve25519", {
        type: "mont",
        prime: "p25519",
        p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
        a: "76d06",
        b: "1",
        n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
        hash: o.sha256,
        gRed: !1,
        g: [ "9" ]
    }), c("ed25519", {
        type: "edwards",
        prime: "p25519",
        p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
        a: "-1",
        c: "1",
        d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
        n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
        hash: o.sha256,
        gRed: !1,
        g: [ "216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a", "6666666666666666666666666666666666666666666666666666666666666658" ]
    });
    try {
        n = r(128);
    } catch (e) {
        n = void 0;
    }
    c("secp256k1", {
        type: "short",
        prime: "k256",
        p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
        a: "0",
        b: "7",
        n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
        h: "1",
        hash: o.sha256,
        beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
        lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
        basis: [ {
            a: "3086d221a7d46bcde86c90e49284eb15",
            b: "-e4437ed6010e88286f547fa90abfe4c3"
        }, {
            a: "114ca50f7a8e2f3f657c1108d9d44cfd8",
            b: "3086d221a7d46bcde86c90e49284eb15"
        } ],
        gRed: !1,
        g: [ "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8", n ]
    });
}, function(e, t, r) {
    var n = t;
    n.utils = r(117), n.common = r(118), n.sha = r(119), n.ripemd = r(126), n.hmac = r(127), 
    n.sha1 = n.sha.sha1, n.sha256 = n.sha.sha256, n.sha224 = n.sha.sha224, n.sha384 = n.sha.sha384, 
    n.sha512 = n.sha.sha512, n.ripemd160 = n.ripemd.ripemd160;
}, function(e, t, r) {
    "use strict";
    var n = r(69), i = r(17);
    function o(e, t) {
        return 55296 == (64512 & e.charCodeAt(t)) && (!(t < 0 || t + 1 >= e.length) && 56320 == (64512 & e.charCodeAt(t + 1)));
    }
    function a(e) {
        return (e >>> 24 | e >>> 8 & 65280 | e << 8 & 16711680 | (255 & e) << 24) >>> 0;
    }
    function s(e) {
        return 1 === e.length ? "0" + e : e;
    }
    function f(e) {
        return 7 === e.length ? "0" + e : 6 === e.length ? "00" + e : 5 === e.length ? "000" + e : 4 === e.length ? "0000" + e : 3 === e.length ? "00000" + e : 2 === e.length ? "000000" + e : 1 === e.length ? "0000000" + e : e;
    }
    t.inherits = i, t.toArray = function(e, t) {
        if (Array.isArray(e)) return e.slice();
        if (!e) return [];
        var r = [];
        if ("string" == typeof e) if (t) {
            if ("hex" === t) for ((e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e = "0" + e), 
            i = 0; i < e.length; i += 2) r.push(parseInt(e[i] + e[i + 1], 16));
        } else for (var n = 0, i = 0; i < e.length; i++) {
            var a = e.charCodeAt(i);
            a < 128 ? r[n++] = a : a < 2048 ? (r[n++] = a >> 6 | 192, r[n++] = 63 & a | 128) : o(e, i) ? (a = 65536 + ((1023 & a) << 10) + (1023 & e.charCodeAt(++i)), 
            r[n++] = a >> 18 | 240, r[n++] = a >> 12 & 63 | 128, r[n++] = a >> 6 & 63 | 128, 
            r[n++] = 63 & a | 128) : (r[n++] = a >> 12 | 224, r[n++] = a >> 6 & 63 | 128, r[n++] = 63 & a | 128);
        } else for (i = 0; i < e.length; i++) r[i] = 0 | e[i];
        return r;
    }, t.toHex = function(e) {
        for (var t = "", r = 0; r < e.length; r++) t += s(e[r].toString(16));
        return t;
    }, t.htonl = a, t.toHex32 = function(e, t) {
        for (var r = "", n = 0; n < e.length; n++) {
            var i = e[n];
            "little" === t && (i = a(i)), r += f(i.toString(16));
        }
        return r;
    }, t.zero2 = s, t.zero8 = f, t.join32 = function(e, t, r, i) {
        var o = r - t;
        n(o % 4 == 0);
        for (var a = new Array(o / 4), s = 0, f = t; s < a.length; s++, f += 4) {
            var c;
            c = "big" === i ? e[f] << 24 | e[f + 1] << 16 | e[f + 2] << 8 | e[f + 3] : e[f + 3] << 24 | e[f + 2] << 16 | e[f + 1] << 8 | e[f], 
            a[s] = c >>> 0;
        }
        return a;
    }, t.split32 = function(e, t) {
        for (var r = new Array(4 * e.length), n = 0, i = 0; n < e.length; n++, i += 4) {
            var o = e[n];
            "big" === t ? (r[i] = o >>> 24, r[i + 1] = o >>> 16 & 255, r[i + 2] = o >>> 8 & 255, 
            r[i + 3] = 255 & o) : (r[i + 3] = o >>> 24, r[i + 2] = o >>> 16 & 255, r[i + 1] = o >>> 8 & 255, 
            r[i] = 255 & o);
        }
        return r;
    }, t.rotr32 = function(e, t) {
        return e >>> t | e << 32 - t;
    }, t.rotl32 = function(e, t) {
        return e << t | e >>> 32 - t;
    }, t.sum32 = function(e, t) {
        return e + t >>> 0;
    }, t.sum32_3 = function(e, t, r) {
        return e + t + r >>> 0;
    }, t.sum32_4 = function(e, t, r, n) {
        return e + t + r + n >>> 0;
    }, t.sum32_5 = function(e, t, r, n, i) {
        return e + t + r + n + i >>> 0;
    }, t.sum64 = function(e, t, r, n) {
        var i = e[t], o = n + e[t + 1] >>> 0, a = (o < n ? 1 : 0) + r + i;
        e[t] = a >>> 0, e[t + 1] = o;
    }, t.sum64_hi = function(e, t, r, n) {
        return (t + n >>> 0 < t ? 1 : 0) + e + r >>> 0;
    }, t.sum64_lo = function(e, t, r, n) {
        return t + n >>> 0;
    }, t.sum64_4_hi = function(e, t, r, n, i, o, a, s) {
        var f = 0, c = t;
        return f += (c = c + n >>> 0) < t ? 1 : 0, f += (c = c + o >>> 0) < o ? 1 : 0, e + r + i + a + (f += (c = c + s >>> 0) < s ? 1 : 0) >>> 0;
    }, t.sum64_4_lo = function(e, t, r, n, i, o, a, s) {
        return t + n + o + s >>> 0;
    }, t.sum64_5_hi = function(e, t, r, n, i, o, a, s, f, c) {
        var u = 0, d = t;
        return u += (d = d + n >>> 0) < t ? 1 : 0, u += (d = d + o >>> 0) < o ? 1 : 0, u += (d = d + s >>> 0) < s ? 1 : 0, 
        e + r + i + a + f + (u += (d = d + c >>> 0) < c ? 1 : 0) >>> 0;
    }, t.sum64_5_lo = function(e, t, r, n, i, o, a, s, f, c) {
        return t + n + o + s + c >>> 0;
    }, t.rotr64_hi = function(e, t, r) {
        return (t << 32 - r | e >>> r) >>> 0;
    }, t.rotr64_lo = function(e, t, r) {
        return (e << 32 - r | t >>> r) >>> 0;
    }, t.shr64_hi = function(e, t, r) {
        return e >>> r;
    }, t.shr64_lo = function(e, t, r) {
        return (e << 32 - r | t >>> r) >>> 0;
    };
}, function(e, t, r) {
    "use strict";
    var n = r(117), i = r(69);
    function o() {
        this.pending = null, this.pendingTotal = 0, this.blockSize = this.constructor.blockSize, 
        this.outSize = this.constructor.outSize, this.hmacStrength = this.constructor.hmacStrength, 
        this.padLength = this.constructor.padLength / 8, this.endian = "big", this._delta8 = this.blockSize / 8, 
        this._delta32 = this.blockSize / 32;
    }
    t.BlockHash = o, o.prototype.update = function(e, t) {
        if (e = n.toArray(e, t), this.pending ? this.pending = this.pending.concat(e) : this.pending = e, 
        this.pendingTotal += e.length, this.pending.length >= this._delta8) {
            var r = (e = this.pending).length % this._delta8;
            this.pending = e.slice(e.length - r, e.length), 0 === this.pending.length && (this.pending = null), 
            e = n.join32(e, 0, e.length - r, this.endian);
            for (var i = 0; i < e.length; i += this._delta32) this._update(e, i, i + this._delta32);
        }
        return this;
    }, o.prototype.digest = function(e) {
        return this.update(this._pad()), i(null === this.pending), this._digest(e);
    }, o.prototype._pad = function() {
        var e = this.pendingTotal, t = this._delta8, r = t - (e + this.padLength) % t, n = new Array(r + this.padLength);
        n[0] = 128;
        for (var i = 1; i < r; i++) n[i] = 0;
        if (e <<= 3, "big" === this.endian) {
            for (var o = 8; o < this.padLength; o++) n[i++] = 0;
            n[i++] = 0, n[i++] = 0, n[i++] = 0, n[i++] = 0, n[i++] = e >>> 24 & 255, n[i++] = e >>> 16 & 255, 
            n[i++] = e >>> 8 & 255, n[i++] = 255 & e;
        } else for (n[i++] = 255 & e, n[i++] = e >>> 8 & 255, n[i++] = e >>> 16 & 255, n[i++] = e >>> 24 & 255, 
        n[i++] = 0, n[i++] = 0, n[i++] = 0, n[i++] = 0, o = 8; o < this.padLength; o++) n[i++] = 0;
        return n;
    };
}, function(e, t, r) {
    "use strict";
    t.sha1 = r(120), t.sha224 = r(122), t.sha256 = r(123), t.sha384 = r(124), t.sha512 = r(125);
}, function(e, t, r) {
    "use strict";
    var n = r(117), i = r(118), o = r(121), a = n.rotl32, s = n.sum32, f = n.sum32_5, c = o.ft_1, u = i.BlockHash, d = [ 1518500249, 1859775393, 2400959708, 3395469782 ];
    function h() {
        if (!(this instanceof h)) return new h;
        u.call(this), this.h = [ 1732584193, 4023233417, 2562383102, 271733878, 3285377520 ], 
        this.W = new Array(80);
    }
    n.inherits(h, u), e.exports = h, h.blockSize = 512, h.outSize = 160, h.hmacStrength = 80, 
    h.padLength = 64, h.prototype._update = function(e, t) {
        for (var r = this.W, n = 0; n < 16; n++) r[n] = e[t + n];
        for (;n < r.length; n++) r[n] = a(r[n - 3] ^ r[n - 8] ^ r[n - 14] ^ r[n - 16], 1);
        var i = this.h[0], o = this.h[1], u = this.h[2], h = this.h[3], l = this.h[4];
        for (n = 0; n < r.length; n++) {
            var p = ~~(n / 20), b = f(a(i, 5), c(p, o, u, h), l, r[n], d[p]);
            l = h, h = u, u = a(o, 30), o = i, i = b;
        }
        this.h[0] = s(this.h[0], i), this.h[1] = s(this.h[1], o), this.h[2] = s(this.h[2], u), 
        this.h[3] = s(this.h[3], h), this.h[4] = s(this.h[4], l);
    }, h.prototype._digest = function(e) {
        return "hex" === e ? n.toHex32(this.h, "big") : n.split32(this.h, "big");
    };
}, function(e, t, r) {
    "use strict";
    var n = r(117).rotr32;
    function i(e, t, r) {
        return e & t ^ ~e & r;
    }
    function o(e, t, r) {
        return e & t ^ e & r ^ t & r;
    }
    function a(e, t, r) {
        return e ^ t ^ r;
    }
    t.ft_1 = function(e, t, r, n) {
        return 0 === e ? i(t, r, n) : 1 === e || 3 === e ? a(t, r, n) : 2 === e ? o(t, r, n) : void 0;
    }, t.ch32 = i, t.maj32 = o, t.p32 = a, t.s0_256 = function(e) {
        return n(e, 2) ^ n(e, 13) ^ n(e, 22);
    }, t.s1_256 = function(e) {
        return n(e, 6) ^ n(e, 11) ^ n(e, 25);
    }, t.g0_256 = function(e) {
        return n(e, 7) ^ n(e, 18) ^ e >>> 3;
    }, t.g1_256 = function(e) {
        return n(e, 17) ^ n(e, 19) ^ e >>> 10;
    };
}, function(e, t, r) {
    "use strict";
    var n = r(117), i = r(123);
    function o() {
        if (!(this instanceof o)) return new o;
        i.call(this), this.h = [ 3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428 ];
    }
    n.inherits(o, i), e.exports = o, o.blockSize = 512, o.outSize = 224, o.hmacStrength = 192, 
    o.padLength = 64, o.prototype._digest = function(e) {
        return "hex" === e ? n.toHex32(this.h.slice(0, 7), "big") : n.split32(this.h.slice(0, 7), "big");
    };
}, function(e, t, r) {
    "use strict";
    var n = r(117), i = r(118), o = r(121), a = r(69), s = n.sum32, f = n.sum32_4, c = n.sum32_5, u = o.ch32, d = o.maj32, h = o.s0_256, l = o.s1_256, p = o.g0_256, b = o.g1_256, m = i.BlockHash, g = [ 1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298 ];
    function y() {
        if (!(this instanceof y)) return new y;
        m.call(this), this.h = [ 1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225 ], 
        this.k = g, this.W = new Array(64);
    }
    n.inherits(y, m), e.exports = y, y.blockSize = 512, y.outSize = 256, y.hmacStrength = 192, 
    y.padLength = 64, y.prototype._update = function(e, t) {
        for (var r = this.W, n = 0; n < 16; n++) r[n] = e[t + n];
        for (;n < r.length; n++) r[n] = f(b(r[n - 2]), r[n - 7], p(r[n - 15]), r[n - 16]);
        var i = this.h[0], o = this.h[1], m = this.h[2], g = this.h[3], y = this.h[4], v = this.h[5], w = this.h[6], _ = this.h[7];
        for (a(this.k.length === r.length), n = 0; n < r.length; n++) {
            var x = c(_, l(y), u(y, v, w), this.k[n], r[n]), S = s(h(i), d(i, o, m));
            _ = w, w = v, v = y, y = s(g, x), g = m, m = o, o = i, i = s(x, S);
        }
        this.h[0] = s(this.h[0], i), this.h[1] = s(this.h[1], o), this.h[2] = s(this.h[2], m), 
        this.h[3] = s(this.h[3], g), this.h[4] = s(this.h[4], y), this.h[5] = s(this.h[5], v), 
        this.h[6] = s(this.h[6], w), this.h[7] = s(this.h[7], _);
    }, y.prototype._digest = function(e) {
        return "hex" === e ? n.toHex32(this.h, "big") : n.split32(this.h, "big");
    };
}, function(e, t, r) {
    "use strict";
    var n = r(117), i = r(125);
    function o() {
        if (!(this instanceof o)) return new o;
        i.call(this), this.h = [ 3418070365, 3238371032, 1654270250, 914150663, 2438529370, 812702999, 355462360, 4144912697, 1731405415, 4290775857, 2394180231, 1750603025, 3675008525, 1694076839, 1203062813, 3204075428 ];
    }
    n.inherits(o, i), e.exports = o, o.blockSize = 1024, o.outSize = 384, o.hmacStrength = 192, 
    o.padLength = 128, o.prototype._digest = function(e) {
        return "hex" === e ? n.toHex32(this.h.slice(0, 12), "big") : n.split32(this.h.slice(0, 12), "big");
    };
}, function(e, t, r) {
    "use strict";
    var n = r(117), i = r(118), o = r(69), a = n.rotr64_hi, s = n.rotr64_lo, f = n.shr64_hi, c = n.shr64_lo, u = n.sum64, d = n.sum64_hi, h = n.sum64_lo, l = n.sum64_4_hi, p = n.sum64_4_lo, b = n.sum64_5_hi, m = n.sum64_5_lo, g = i.BlockHash, y = [ 1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591 ];
    function v() {
        if (!(this instanceof v)) return new v;
        g.call(this), this.h = [ 1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209 ], 
        this.k = y, this.W = new Array(160);
    }
    function w(e, t, r, n, i) {
        var o = e & r ^ ~e & i;
        return o < 0 && (o += 4294967296), o;
    }
    function _(e, t, r, n, i, o) {
        var a = t & n ^ ~t & o;
        return a < 0 && (a += 4294967296), a;
    }
    function x(e, t, r, n, i) {
        var o = e & r ^ e & i ^ r & i;
        return o < 0 && (o += 4294967296), o;
    }
    function S(e, t, r, n, i, o) {
        var a = t & n ^ t & o ^ n & o;
        return a < 0 && (a += 4294967296), a;
    }
    function A(e, t) {
        var r = a(e, t, 28) ^ a(t, e, 2) ^ a(t, e, 7);
        return r < 0 && (r += 4294967296), r;
    }
    function E(e, t) {
        var r = s(e, t, 28) ^ s(t, e, 2) ^ s(t, e, 7);
        return r < 0 && (r += 4294967296), r;
    }
    function M(e, t) {
        var r = a(e, t, 14) ^ a(e, t, 18) ^ a(t, e, 9);
        return r < 0 && (r += 4294967296), r;
    }
    function k(e, t) {
        var r = s(e, t, 14) ^ s(e, t, 18) ^ s(t, e, 9);
        return r < 0 && (r += 4294967296), r;
    }
    function C(e, t) {
        var r = a(e, t, 1) ^ a(e, t, 8) ^ f(e, t, 7);
        return r < 0 && (r += 4294967296), r;
    }
    function T(e, t) {
        var r = s(e, t, 1) ^ s(e, t, 8) ^ c(e, t, 7);
        return r < 0 && (r += 4294967296), r;
    }
    function I(e, t) {
        var r = a(e, t, 19) ^ a(t, e, 29) ^ f(e, t, 6);
        return r < 0 && (r += 4294967296), r;
    }
    function B(e, t) {
        var r = s(e, t, 19) ^ s(t, e, 29) ^ c(e, t, 6);
        return r < 0 && (r += 4294967296), r;
    }
    n.inherits(v, g), e.exports = v, v.blockSize = 1024, v.outSize = 512, v.hmacStrength = 192, 
    v.padLength = 128, v.prototype._prepareBlock = function(e, t) {
        for (var r = this.W, n = 0; n < 32; n++) r[n] = e[t + n];
        for (;n < r.length; n += 2) {
            var i = I(r[n - 4], r[n - 3]), o = B(r[n - 4], r[n - 3]), a = r[n - 14], s = r[n - 13], f = C(r[n - 30], r[n - 29]), c = T(r[n - 30], r[n - 29]), u = r[n - 32], d = r[n - 31];
            r[n] = l(i, o, a, s, f, c, u, d), r[n + 1] = p(i, o, a, s, f, c, u, d);
        }
    }, v.prototype._update = function(e, t) {
        this._prepareBlock(e, t);
        var r = this.W, n = this.h[0], i = this.h[1], a = this.h[2], s = this.h[3], f = this.h[4], c = this.h[5], l = this.h[6], p = this.h[7], g = this.h[8], y = this.h[9], v = this.h[10], C = this.h[11], T = this.h[12], I = this.h[13], B = this.h[14], j = this.h[15];
        o(this.k.length === r.length);
        for (var R = 0; R < r.length; R += 2) {
            var D = B, P = j, q = M(g, y), N = k(g, y), O = w(g, y, v, C, T), L = _(g, y, v, C, T, I), U = this.k[R], z = this.k[R + 1], H = r[R], F = r[R + 1], W = b(D, P, q, N, O, L, U, z, H, F), K = m(D, P, q, N, O, L, U, z, H, F);
            D = A(n, i), P = E(n, i), q = x(n, i, a, s, f), N = S(n, i, a, s, f, c);
            var Y = d(D, P, q, N), V = h(D, P, q, N);
            B = T, j = I, T = v, I = C, v = g, C = y, g = d(l, p, W, K), y = h(p, p, W, K), 
            l = f, p = c, f = a, c = s, a = n, s = i, n = d(W, K, Y, V), i = h(W, K, Y, V);
        }
        u(this.h, 0, n, i), u(this.h, 2, a, s), u(this.h, 4, f, c), u(this.h, 6, l, p), 
        u(this.h, 8, g, y), u(this.h, 10, v, C), u(this.h, 12, T, I), u(this.h, 14, B, j);
    }, v.prototype._digest = function(e) {
        return "hex" === e ? n.toHex32(this.h, "big") : n.split32(this.h, "big");
    };
}, function(e, t, r) {
    "use strict";
    var n = r(117), i = r(118), o = n.rotl32, a = n.sum32, s = n.sum32_3, f = n.sum32_4, c = i.BlockHash;
    function u() {
        if (!(this instanceof u)) return new u;
        c.call(this), this.h = [ 1732584193, 4023233417, 2562383102, 271733878, 3285377520 ], 
        this.endian = "little";
    }
    function d(e, t, r, n) {
        return e <= 15 ? t ^ r ^ n : e <= 31 ? t & r | ~t & n : e <= 47 ? (t | ~r) ^ n : e <= 63 ? t & n | r & ~n : t ^ (r | ~n);
    }
    function h(e) {
        return e <= 15 ? 0 : e <= 31 ? 1518500249 : e <= 47 ? 1859775393 : e <= 63 ? 2400959708 : 2840853838;
    }
    function l(e) {
        return e <= 15 ? 1352829926 : e <= 31 ? 1548603684 : e <= 47 ? 1836072691 : e <= 63 ? 2053994217 : 0;
    }
    n.inherits(u, c), t.ripemd160 = u, u.blockSize = 512, u.outSize = 160, u.hmacStrength = 192, 
    u.padLength = 64, u.prototype._update = function(e, t) {
        for (var r = this.h[0], n = this.h[1], i = this.h[2], c = this.h[3], u = this.h[4], y = r, v = n, w = i, _ = c, x = u, S = 0; S < 80; S++) {
            var A = a(o(f(r, d(S, n, i, c), e[p[S] + t], h(S)), m[S]), u);
            r = u, u = c, c = o(i, 10), i = n, n = A, A = a(o(f(y, d(79 - S, v, w, _), e[b[S] + t], l(S)), g[S]), x), 
            y = x, x = _, _ = o(w, 10), w = v, v = A;
        }
        A = s(this.h[1], i, _), this.h[1] = s(this.h[2], c, x), this.h[2] = s(this.h[3], u, y), 
        this.h[3] = s(this.h[4], r, v), this.h[4] = s(this.h[0], n, w), this.h[0] = A;
    }, u.prototype._digest = function(e) {
        return "hex" === e ? n.toHex32(this.h, "little") : n.split32(this.h, "little");
    };
    var p = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13 ], b = [ 5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11 ], m = [ 11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6 ], g = [ 8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11 ];
}, function(e, t, r) {
    "use strict";
    var n = r(117), i = r(69);
    function o(e, t, r) {
        if (!(this instanceof o)) return new o(e, t, r);
        this.Hash = e, this.blockSize = e.blockSize / 8, this.outSize = e.outSize / 8, this.inner = null, 
        this.outer = null, this._init(n.toArray(t, r));
    }
    e.exports = o, o.prototype._init = function(e) {
        e.length > this.blockSize && (e = (new this.Hash).update(e).digest()), i(e.length <= this.blockSize);
        for (var t = e.length; t < this.blockSize; t++) e.push(0);
        for (t = 0; t < e.length; t++) e[t] ^= 54;
        for (this.inner = (new this.Hash).update(e), t = 0; t < e.length; t++) e[t] ^= 106;
        this.outer = (new this.Hash).update(e);
    }, o.prototype.update = function(e, t) {
        return this.inner.update(e, t), this;
    }, o.prototype.digest = function(e) {
        return this.outer.update(this.inner.digest()), this.outer.digest(e);
    };
}, function(e, t) {
    e.exports = {
        doubles: {
            step: 4,
            points: [ [ "e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a", "f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821" ], [ "8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508", "11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf" ], [ "175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739", "d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695" ], [ "363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640", "4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9" ], [ "8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c", "4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36" ], [ "723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda", "96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f" ], [ "eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa", "5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999" ], [ "100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0", "cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09" ], [ "e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d", "9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d" ], [ "feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d", "e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088" ], [ "da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1", "9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d" ], [ "53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0", "5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8" ], [ "8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047", "10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a" ], [ "385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862", "283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453" ], [ "6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7", "7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160" ], [ "3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd", "56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0" ], [ "85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83", "7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6" ], [ "948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a", "53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589" ], [ "6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8", "bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17" ], [ "e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d", "4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda" ], [ "e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725", "7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd" ], [ "213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754", "4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2" ], [ "4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c", "17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6" ], [ "fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6", "6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f" ], [ "76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39", "c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01" ], [ "c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891", "893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3" ], [ "d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b", "febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f" ], [ "b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03", "2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7" ], [ "e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d", "eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78" ], [ "a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070", "7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1" ], [ "90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4", "e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150" ], [ "8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da", "662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82" ], [ "e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11", "1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc" ], [ "8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e", "efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b" ], [ "e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41", "2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51" ], [ "b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef", "67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45" ], [ "d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8", "db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120" ], [ "324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d", "648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84" ], [ "4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96", "35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d" ], [ "9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd", "ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d" ], [ "6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5", "9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8" ], [ "a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266", "40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8" ], [ "7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71", "34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac" ], [ "928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac", "c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f" ], [ "85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751", "1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962" ], [ "ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e", "493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907" ], [ "827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241", "c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec" ], [ "eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3", "be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d" ], [ "e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f", "4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414" ], [ "1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19", "aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd" ], [ "146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be", "b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0" ], [ "fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9", "6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811" ], [ "da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2", "8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1" ], [ "a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13", "7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c" ], [ "174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c", "ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73" ], [ "959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba", "2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd" ], [ "d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151", "e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405" ], [ "64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073", "d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589" ], [ "8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458", "38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e" ], [ "13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b", "69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27" ], [ "bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366", "d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1" ], [ "8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa", "40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482" ], [ "8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0", "620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945" ], [ "dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787", "7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573" ], [ "f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e", "ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82" ] ]
        },
        naf: {
            wnd: 7,
            points: [ [ "f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9", "388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672" ], [ "2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4", "d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6" ], [ "5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc", "6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da" ], [ "acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe", "cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37" ], [ "774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb", "d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b" ], [ "f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8", "ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81" ], [ "d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e", "581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58" ], [ "defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34", "4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77" ], [ "2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c", "85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a" ], [ "352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5", "321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c" ], [ "2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f", "2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67" ], [ "9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714", "73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402" ], [ "daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729", "a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55" ], [ "c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db", "2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482" ], [ "6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4", "e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82" ], [ "1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5", "b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396" ], [ "605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479", "2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49" ], [ "62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d", "80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf" ], [ "80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f", "1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a" ], [ "7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb", "d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7" ], [ "d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9", "eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933" ], [ "49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963", "758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a" ], [ "77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74", "958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6" ], [ "f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530", "e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37" ], [ "463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b", "5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e" ], [ "f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247", "cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6" ], [ "caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1", "cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476" ], [ "2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120", "4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40" ], [ "7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435", "91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61" ], [ "754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18", "673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683" ], [ "e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8", "59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5" ], [ "186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb", "3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b" ], [ "df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f", "55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417" ], [ "5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143", "efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868" ], [ "290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba", "e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a" ], [ "af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45", "f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6" ], [ "766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a", "744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996" ], [ "59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e", "c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e" ], [ "f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8", "e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d" ], [ "7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c", "30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2" ], [ "948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519", "e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e" ], [ "7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab", "100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437" ], [ "3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca", "ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311" ], [ "d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf", "8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4" ], [ "1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610", "68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575" ], [ "733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4", "f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d" ], [ "15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c", "d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d" ], [ "a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940", "edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629" ], [ "e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980", "a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06" ], [ "311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3", "66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374" ], [ "34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf", "9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee" ], [ "f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63", "4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1" ], [ "d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448", "fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b" ], [ "32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf", "5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661" ], [ "7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5", "8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6" ], [ "ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6", "8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e" ], [ "16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5", "5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d" ], [ "eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99", "f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc" ], [ "78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51", "f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4" ], [ "494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5", "42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c" ], [ "a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5", "204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b" ], [ "c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997", "4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913" ], [ "841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881", "73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154" ], [ "5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5", "39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865" ], [ "36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66", "d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc" ], [ "336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726", "ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224" ], [ "8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede", "6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e" ], [ "1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94", "60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6" ], [ "85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31", "3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511" ], [ "29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51", "b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b" ], [ "a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252", "ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2" ], [ "4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5", "cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c" ], [ "d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b", "6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3" ], [ "ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4", "322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d" ], [ "af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f", "6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700" ], [ "e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889", "2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4" ], [ "591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246", "b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196" ], [ "11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984", "998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4" ], [ "3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a", "b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257" ], [ "cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030", "bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13" ], [ "c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197", "6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096" ], [ "c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593", "c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38" ], [ "a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef", "21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f" ], [ "347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38", "60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448" ], [ "da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a", "49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a" ], [ "c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111", "5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4" ], [ "4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502", "7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437" ], [ "3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea", "be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7" ], [ "cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26", "8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d" ], [ "b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986", "39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a" ], [ "d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e", "62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54" ], [ "48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4", "25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77" ], [ "dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda", "ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517" ], [ "6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859", "cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10" ], [ "e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f", "f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125" ], [ "eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c", "6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e" ], [ "13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942", "fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1" ], [ "ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a", "1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2" ], [ "b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80", "5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423" ], [ "ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d", "438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8" ], [ "8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1", "cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758" ], [ "52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63", "c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375" ], [ "e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352", "6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d" ], [ "7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193", "ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec" ], [ "5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00", "9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0" ], [ "32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58", "ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c" ], [ "e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7", "d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4" ], [ "8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8", "c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f" ], [ "4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e", "67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649" ], [ "3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d", "cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826" ], [ "674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b", "299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5" ], [ "d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f", "f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87" ], [ "30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6", "462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b" ], [ "be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297", "62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc" ], [ "93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a", "7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c" ], [ "b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c", "ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f" ], [ "d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52", "4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a" ], [ "d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb", "bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46" ], [ "463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065", "bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f" ], [ "7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917", "603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03" ], [ "74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9", "cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08" ], [ "30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3", "553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8" ], [ "9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57", "712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373" ], [ "176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66", "ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3" ], [ "75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8", "9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8" ], [ "809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721", "9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1" ], [ "1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180", "4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9" ] ]
        }
    };
}, function(e, t, r) {
    "use strict";
    var n = r(95), i = r(130), o = r(108), a = r(115), s = r(99), f = o.assert, c = r(131), u = r(132);
    function d(e) {
        if (!(this instanceof d)) return new d(e);
        "string" == typeof e && (f(a.hasOwnProperty(e), "Unknown curve " + e), e = a[e]), 
        e instanceof a.PresetCurve && (e = {
            curve: e
        }), this.curve = e.curve.curve, this.n = this.curve.n, this.nh = this.n.ushrn(1), 
        this.g = this.curve.g, this.g = e.curve.g, this.g.precompute(e.curve.n.bitLength() + 1), 
        this.hash = e.hash || e.curve.hash;
    }
    e.exports = d, d.prototype.keyPair = function(e) {
        return new c(this, e);
    }, d.prototype.keyFromPrivate = function(e, t) {
        return c.fromPrivate(this, e, t);
    }, d.prototype.keyFromPublic = function(e, t) {
        return c.fromPublic(this, e, t);
    }, d.prototype.genKeyPair = function(e) {
        e || (e = {});
        for (var t = new i({
            hash: this.hash,
            pers: e.pers,
            persEnc: e.persEnc || "utf8",
            entropy: e.entropy || s(this.hash.hmacStrength),
            entropyEnc: e.entropy && e.entropyEnc || "utf8",
            nonce: this.n.toArray()
        }), r = this.n.byteLength(), o = this.n.sub(new n(2)); ;) {
            var a = new n(t.generate(r));
            if (!(a.cmp(o) > 0)) return a.iaddn(1), this.keyFromPrivate(a);
        }
    }, d.prototype._truncateToN = function(e, t) {
        var r = 8 * e.byteLength() - this.n.bitLength();
        return r > 0 && (e = e.ushrn(r)), !t && e.cmp(this.n) >= 0 ? e.sub(this.n) : e;
    }, d.prototype.sign = function(e, t, r, o) {
        "object" == typeof r && (o = r, r = null), o || (o = {}), t = this.keyFromPrivate(t, r), 
        e = this._truncateToN(new n(e, 16));
        for (var a = this.n.byteLength(), s = t.getPrivate().toArray("be", a), f = e.toArray("be", a), c = new i({
            hash: this.hash,
            entropy: s,
            nonce: f,
            pers: o.pers,
            persEnc: o.persEnc || "utf8"
        }), d = this.n.sub(new n(1)), h = 0; ;h++) {
            var l = o.k ? o.k(h) : new n(c.generate(this.n.byteLength()));
            if (!((l = this._truncateToN(l, !0)).cmpn(1) <= 0 || l.cmp(d) >= 0)) {
                var p = this.g.mul(l);
                if (!p.isInfinity()) {
                    var b = p.getX(), m = b.umod(this.n);
                    if (0 !== m.cmpn(0)) {
                        var g = l.invm(this.n).mul(m.mul(t.getPrivate()).iadd(e));
                        if (0 !== (g = g.umod(this.n)).cmpn(0)) {
                            var y = (p.getY().isOdd() ? 1 : 0) | (0 !== b.cmp(m) ? 2 : 0);
                            return o.canonical && g.cmp(this.nh) > 0 && (g = this.n.sub(g), y ^= 1), new u({
                                r: m,
                                s: g,
                                recoveryParam: y
                            });
                        }
                    }
                }
            }
        }
    }, d.prototype.verify = function(e, t, r, i) {
        e = this._truncateToN(new n(e, 16)), r = this.keyFromPublic(r, i);
        var o = (t = new u(t, "hex")).r, a = t.s;
        if (o.cmpn(1) < 0 || o.cmp(this.n) >= 0) return !1;
        if (a.cmpn(1) < 0 || a.cmp(this.n) >= 0) return !1;
        var s, f = a.invm(this.n), c = f.mul(e).umod(this.n), d = f.mul(o).umod(this.n);
        return this.curve._maxwellTrick ? !(s = this.g.jmulAdd(c, r.getPublic(), d)).isInfinity() && s.eqXToP(o) : !(s = this.g.mulAdd(c, r.getPublic(), d)).isInfinity() && 0 === s.getX().umod(this.n).cmp(o);
    }, d.prototype.recoverPubKey = function(e, t, r, i) {
        f((3 & r) === r, "The recovery param is more than two bits"), t = new u(t, i);
        var o = this.n, a = new n(e), s = t.r, c = t.s, d = 1 & r, h = r >> 1;
        if (s.cmp(this.curve.p.umod(this.curve.n)) >= 0 && h) throw new Error("Unable to find sencond key candinate");
        s = h ? this.curve.pointFromX(s.add(this.curve.n), d) : this.curve.pointFromX(s, d);
        var l = t.r.invm(o), p = o.sub(a).mul(l).umod(o), b = c.mul(l).umod(o);
        return this.g.mulAdd(p, s, b);
    }, d.prototype.getKeyRecoveryParam = function(e, t, r, n) {
        if (null !== (t = new u(t, n)).recoveryParam) return t.recoveryParam;
        for (var i = 0; i < 4; i++) {
            var o;
            try {
                o = this.recoverPubKey(e, t, i);
            } catch (e) {
                continue;
            }
            if (o.eq(r)) return i;
        }
        throw new Error("Unable to find valid recovery factor");
    };
}, function(e, t, r) {
    "use strict";
    var n = r(116), i = r(109), o = r(69);
    function a(e) {
        if (!(this instanceof a)) return new a(e);
        this.hash = e.hash, this.predResist = !!e.predResist, this.outLen = this.hash.outSize, 
        this.minEntropy = e.minEntropy || this.hash.hmacStrength, this._reseed = null, this.reseedInterval = null, 
        this.K = null, this.V = null;
        var t = i.toArray(e.entropy, e.entropyEnc || "hex"), r = i.toArray(e.nonce, e.nonceEnc || "hex"), n = i.toArray(e.pers, e.persEnc || "hex");
        o(t.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), 
        this._init(t, r, n);
    }
    e.exports = a, a.prototype._init = function(e, t, r) {
        var n = e.concat(t).concat(r);
        this.K = new Array(this.outLen / 8), this.V = new Array(this.outLen / 8);
        for (var i = 0; i < this.V.length; i++) this.K[i] = 0, this.V[i] = 1;
        this._update(n), this._reseed = 1, this.reseedInterval = 281474976710656;
    }, a.prototype._hmac = function() {
        return new n.hmac(this.hash, this.K);
    }, a.prototype._update = function(e) {
        var t = this._hmac().update(this.V).update([ 0 ]);
        e && (t = t.update(e)), this.K = t.digest(), this.V = this._hmac().update(this.V).digest(), 
        e && (this.K = this._hmac().update(this.V).update([ 1 ]).update(e).digest(), this.V = this._hmac().update(this.V).digest());
    }, a.prototype.reseed = function(e, t, r, n) {
        "string" != typeof t && (n = r, r = t, t = null), e = i.toArray(e, t), r = i.toArray(r, n), 
        o(e.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), 
        this._update(e.concat(r || [])), this._reseed = 1;
    }, a.prototype.generate = function(e, t, r, n) {
        if (this._reseed > this.reseedInterval) throw new Error("Reseed is required");
        "string" != typeof t && (n = r, r = t, t = null), r && (r = i.toArray(r, n || "hex"), 
        this._update(r));
        for (var o = []; o.length < e; ) this.V = this._hmac().update(this.V).digest(), 
        o = o.concat(this.V);
        var a = o.slice(0, e);
        return this._update(r), this._reseed++, i.encode(a, t);
    };
}, function(e, t, r) {
    "use strict";
    var n = r(95), i = r(108).assert;
    function o(e, t) {
        this.ec = e, this.priv = null, this.pub = null, t.priv && this._importPrivate(t.priv, t.privEnc), 
        t.pub && this._importPublic(t.pub, t.pubEnc);
    }
    e.exports = o, o.fromPublic = function(e, t, r) {
        return t instanceof o ? t : new o(e, {
            pub: t,
            pubEnc: r
        });
    }, o.fromPrivate = function(e, t, r) {
        return t instanceof o ? t : new o(e, {
            priv: t,
            privEnc: r
        });
    }, o.prototype.validate = function() {
        var e = this.getPublic();
        return e.isInfinity() ? {
            result: !1,
            reason: "Invalid public key"
        } : e.validate() ? e.mul(this.ec.curve.n).isInfinity() ? {
            result: !0,
            reason: null
        } : {
            result: !1,
            reason: "Public key * N != O"
        } : {
            result: !1,
            reason: "Public key is not a point"
        };
    }, o.prototype.getPublic = function(e, t) {
        return "string" == typeof e && (t = e, e = null), this.pub || (this.pub = this.ec.g.mul(this.priv)), 
        t ? this.pub.encode(t, e) : this.pub;
    }, o.prototype.getPrivate = function(e) {
        return "hex" === e ? this.priv.toString(16, 2) : this.priv;
    }, o.prototype._importPrivate = function(e, t) {
        this.priv = new n(e, t || 16), this.priv = this.priv.umod(this.ec.curve.n);
    }, o.prototype._importPublic = function(e, t) {
        if (e.x || e.y) return "mont" === this.ec.curve.type ? i(e.x, "Need x coordinate") : "short" !== this.ec.curve.type && "edwards" !== this.ec.curve.type || i(e.x && e.y, "Need both x and y coordinate"), 
        void (this.pub = this.ec.curve.point(e.x, e.y));
        this.pub = this.ec.curve.decodePoint(e, t);
    }, o.prototype.derive = function(e) {
        return e.mul(this.priv).getX();
    }, o.prototype.sign = function(e, t, r) {
        return this.ec.sign(e, this, t, r);
    }, o.prototype.verify = function(e, t) {
        return this.ec.verify(e, t, this);
    }, o.prototype.inspect = function() {
        return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >";
    };
}, function(e, t, r) {
    "use strict";
    var n = r(95), i = r(108), o = i.assert;
    function a(e, t) {
        if (e instanceof a) return e;
        this._importDER(e, t) || (o(e.r && e.s, "Signature without r or s"), this.r = new n(e.r, 16), 
        this.s = new n(e.s, 16), void 0 === e.recoveryParam ? this.recoveryParam = null : this.recoveryParam = e.recoveryParam);
    }
    function s() {
        this.place = 0;
    }
    function f(e, t) {
        var r = e[t.place++];
        if (!(128 & r)) return r;
        for (var n = 15 & r, i = 0, o = 0, a = t.place; o < n; o++, a++) i <<= 8, i |= e[a];
        return t.place = a, i;
    }
    function c(e) {
        for (var t = 0, r = e.length - 1; !e[t] && !(128 & e[t + 1]) && t < r; ) t++;
        return 0 === t ? e : e.slice(t);
    }
    function u(e, t) {
        if (t < 128) e.push(t); else {
            var r = 1 + (Math.log(t) / Math.LN2 >>> 3);
            for (e.push(128 | r); --r; ) e.push(t >>> (r << 3) & 255);
            e.push(t);
        }
    }
    e.exports = a, a.prototype._importDER = function(e, t) {
        e = i.toArray(e, t);
        var r = new s;
        if (48 !== e[r.place++]) return !1;
        if (f(e, r) + r.place !== e.length) return !1;
        if (2 !== e[r.place++]) return !1;
        var o = f(e, r), a = e.slice(r.place, o + r.place);
        if (r.place += o, 2 !== e[r.place++]) return !1;
        var c = f(e, r);
        if (e.length !== c + r.place) return !1;
        var u = e.slice(r.place, c + r.place);
        return 0 === a[0] && 128 & a[1] && (a = a.slice(1)), 0 === u[0] && 128 & u[1] && (u = u.slice(1)), 
        this.r = new n(a), this.s = new n(u), this.recoveryParam = null, !0;
    }, a.prototype.toDER = function(e) {
        var t = this.r.toArray(), r = this.s.toArray();
        for (128 & t[0] && (t = [ 0 ].concat(t)), 128 & r[0] && (r = [ 0 ].concat(r)), t = c(t), 
        r = c(r); !(r[0] || 128 & r[1]); ) r = r.slice(1);
        var n = [ 2 ];
        u(n, t.length), (n = n.concat(t)).push(2), u(n, r.length);
        var o = n.concat(r), a = [ 48 ];
        return u(a, o.length), a = a.concat(o), i.encode(a, e);
    };
}, function(e, t, r) {
    "use strict";
    var n = r(116), i = r(115), o = r(108), a = o.assert, s = o.parseBytes, f = r(134), c = r(135);
    function u(e) {
        if (a("ed25519" === e, "only tested with ed25519 so far"), !(this instanceof u)) return new u(e);
        e = i[e].curve;
        this.curve = e, this.g = e.g, this.g.precompute(e.n.bitLength() + 1), this.pointClass = e.point().constructor, 
        this.encodingLength = Math.ceil(e.n.bitLength() / 8), this.hash = n.sha512;
    }
    e.exports = u, u.prototype.sign = function(e, t) {
        e = s(e);
        var r = this.keyFromSecret(t), n = this.hashInt(r.messagePrefix(), e), i = this.g.mul(n), o = this.encodePoint(i), a = this.hashInt(o, r.pubBytes(), e).mul(r.priv()), f = n.add(a).umod(this.curve.n);
        return this.makeSignature({
            R: i,
            S: f,
            Rencoded: o
        });
    }, u.prototype.verify = function(e, t, r) {
        e = s(e), t = this.makeSignature(t);
        var n = this.keyFromPublic(r), i = this.hashInt(t.Rencoded(), n.pubBytes(), e), o = this.g.mul(t.S());
        return t.R().add(n.pub().mul(i)).eq(o);
    }, u.prototype.hashInt = function() {
        for (var e = this.hash(), t = 0; t < arguments.length; t++) e.update(arguments[t]);
        return o.intFromLE(e.digest()).umod(this.curve.n);
    }, u.prototype.keyFromPublic = function(e) {
        return f.fromPublic(this, e);
    }, u.prototype.keyFromSecret = function(e) {
        return f.fromSecret(this, e);
    }, u.prototype.makeSignature = function(e) {
        return e instanceof c ? e : new c(this, e);
    }, u.prototype.encodePoint = function(e) {
        var t = e.getY().toArray("le", this.encodingLength);
        return t[this.encodingLength - 1] |= e.getX().isOdd() ? 128 : 0, t;
    }, u.prototype.decodePoint = function(e) {
        var t = (e = o.parseBytes(e)).length - 1, r = e.slice(0, t).concat(-129 & e[t]), n = 0 != (128 & e[t]), i = o.intFromLE(r);
        return this.curve.pointFromY(i, n);
    }, u.prototype.encodeInt = function(e) {
        return e.toArray("le", this.encodingLength);
    }, u.prototype.decodeInt = function(e) {
        return o.intFromLE(e);
    }, u.prototype.isPoint = function(e) {
        return e instanceof this.pointClass;
    };
}, function(e, t, r) {
    "use strict";
    var n = r(108), i = n.assert, o = n.parseBytes, a = n.cachedProperty;
    function s(e, t) {
        this.eddsa = e, this._secret = o(t.secret), e.isPoint(t.pub) ? this._pub = t.pub : this._pubBytes = o(t.pub);
    }
    s.fromPublic = function(e, t) {
        return t instanceof s ? t : new s(e, {
            pub: t
        });
    }, s.fromSecret = function(e, t) {
        return t instanceof s ? t : new s(e, {
            secret: t
        });
    }, s.prototype.secret = function() {
        return this._secret;
    }, a(s, "pubBytes", (function() {
        return this.eddsa.encodePoint(this.pub());
    })), a(s, "pub", (function() {
        return this._pubBytes ? this.eddsa.decodePoint(this._pubBytes) : this.eddsa.g.mul(this.priv());
    })), a(s, "privBytes", (function() {
        var e = this.eddsa, t = this.hash(), r = e.encodingLength - 1, n = t.slice(0, e.encodingLength);
        return n[0] &= 248, n[r] &= 127, n[r] |= 64, n;
    })), a(s, "priv", (function() {
        return this.eddsa.decodeInt(this.privBytes());
    })), a(s, "hash", (function() {
        return this.eddsa.hash().update(this.secret()).digest();
    })), a(s, "messagePrefix", (function() {
        return this.hash().slice(this.eddsa.encodingLength);
    })), s.prototype.sign = function(e) {
        return i(this._secret, "KeyPair can only verify"), this.eddsa.sign(e, this);
    }, s.prototype.verify = function(e, t) {
        return this.eddsa.verify(e, t, this);
    }, s.prototype.getSecret = function(e) {
        return i(this._secret, "KeyPair is public only"), n.encode(this.secret(), e);
    }, s.prototype.getPublic = function(e) {
        return n.encode(this.pubBytes(), e);
    }, e.exports = s;
}, function(e, t, r) {
    "use strict";
    var n = r(95), i = r(108), o = i.assert, a = i.cachedProperty, s = i.parseBytes;
    function f(e, t) {
        this.eddsa = e, "object" != typeof t && (t = s(t)), Array.isArray(t) && (t = {
            R: t.slice(0, e.encodingLength),
            S: t.slice(e.encodingLength)
        }), o(t.R && t.S, "Signature without R or S"), e.isPoint(t.R) && (this._R = t.R), 
        t.S instanceof n && (this._S = t.S), this._Rencoded = Array.isArray(t.R) ? t.R : t.Rencoded, 
        this._Sencoded = Array.isArray(t.S) ? t.S : t.Sencoded;
    }
    a(f, "S", (function() {
        return this.eddsa.decodeInt(this.Sencoded());
    })), a(f, "R", (function() {
        return this.eddsa.decodePoint(this.Rencoded());
    })), a(f, "Rencoded", (function() {
        return this.eddsa.encodePoint(this.R());
    })), a(f, "Sencoded", (function() {
        return this.eddsa.encodeInt(this.S());
    })), f.prototype.toBytes = function() {
        return this.Rencoded().concat(this.Sencoded());
    }, f.prototype.toHex = function() {
        return i.encode(this.toBytes(), "hex").toUpperCase();
    }, e.exports = f;
}, function(e, t, r) {
    var n = r(137), i = r(154), o = r(155), a = r(73), s = r(59), f = r(11).Buffer;
    function c(e) {
        var t;
        "object" != typeof e || f.isBuffer(e) || (t = e.passphrase, e = e.key), "string" == typeof e && (e = f.from(e));
        var r, c, u = o(e, t), d = u.tag, h = u.data;
        switch (d) {
          case "CERTIFICATE":
            c = n.certificate.decode(h, "der").tbsCertificate.subjectPublicKeyInfo;

          case "PUBLIC KEY":
            switch (c || (c = n.PublicKey.decode(h, "der")), r = c.algorithm.algorithm.join(".")) {
              case "1.2.840.113549.1.1.1":
                return n.RSAPublicKey.decode(c.subjectPublicKey.data, "der");

              case "1.2.840.10045.2.1":
                return c.subjectPrivateKey = c.subjectPublicKey, {
                    type: "ec",
                    data: c
                };

              case "1.2.840.10040.4.1":
                return c.algorithm.params.pub_key = n.DSAparam.decode(c.subjectPublicKey.data, "der"), 
                {
                    type: "dsa",
                    data: c.algorithm.params
                };

              default:
                throw new Error("unknown key id " + r);
            }
            throw new Error("unknown key type " + d);

          case "ENCRYPTED PRIVATE KEY":
            h = function(e, t) {
                var r = e.algorithm.decrypt.kde.kdeparams.salt, n = parseInt(e.algorithm.decrypt.kde.kdeparams.iters.toString(), 10), o = i[e.algorithm.decrypt.cipher.algo.join(".")], c = e.algorithm.decrypt.cipher.iv, u = e.subjectPrivateKey, d = parseInt(o.split("-")[1], 10) / 8, h = s.pbkdf2Sync(t, r, n, d, "sha1"), l = a.createDecipheriv(o, h, c), p = [];
                return p.push(l.update(u)), p.push(l.final()), f.concat(p);
            }(h = n.EncryptedPrivateKey.decode(h, "der"), t);

          case "PRIVATE KEY":
            switch (r = (c = n.PrivateKey.decode(h, "der")).algorithm.algorithm.join(".")) {
              case "1.2.840.113549.1.1.1":
                return n.RSAPrivateKey.decode(c.subjectPrivateKey, "der");

              case "1.2.840.10045.2.1":
                return {
                    curve: c.algorithm.curve,
                    privateKey: n.ECPrivateKey.decode(c.subjectPrivateKey, "der").privateKey
                };

              case "1.2.840.10040.4.1":
                return c.algorithm.params.priv_key = n.DSAparam.decode(c.subjectPrivateKey, "der"), 
                {
                    type: "dsa",
                    params: c.algorithm.params
                };

              default:
                throw new Error("unknown key id " + r);
            }
            throw new Error("unknown key type " + d);

          case "RSA PUBLIC KEY":
            return n.RSAPublicKey.decode(h, "der");

          case "RSA PRIVATE KEY":
            return n.RSAPrivateKey.decode(h, "der");

          case "DSA PRIVATE KEY":
            return {
                type: "dsa",
                params: n.DSAPrivateKey.decode(h, "der")
            };

          case "EC PRIVATE KEY":
            return {
                curve: (h = n.ECPrivateKey.decode(h, "der")).parameters.value,
                privateKey: h.privateKey
            };

          default:
            throw new Error("unknown key type " + d);
        }
    }
    e.exports = c, c.signature = n.signature;
}, function(e, t, r) {
    "use strict";
    var n = r(138);
    t.certificate = r(153);
    var i = n.define("RSAPrivateKey", (function() {
        this.seq().obj(this.key("version").int(), this.key("modulus").int(), this.key("publicExponent").int(), this.key("privateExponent").int(), this.key("prime1").int(), this.key("prime2").int(), this.key("exponent1").int(), this.key("exponent2").int(), this.key("coefficient").int());
    }));
    t.RSAPrivateKey = i;
    var o = n.define("RSAPublicKey", (function() {
        this.seq().obj(this.key("modulus").int(), this.key("publicExponent").int());
    }));
    t.RSAPublicKey = o;
    var a = n.define("SubjectPublicKeyInfo", (function() {
        this.seq().obj(this.key("algorithm").use(s), this.key("subjectPublicKey").bitstr());
    }));
    t.PublicKey = a;
    var s = n.define("AlgorithmIdentifier", (function() {
        this.seq().obj(this.key("algorithm").objid(), this.key("none").null_().optional(), this.key("curve").objid().optional(), this.key("params").seq().obj(this.key("p").int(), this.key("q").int(), this.key("g").int()).optional());
    })), f = n.define("PrivateKeyInfo", (function() {
        this.seq().obj(this.key("version").int(), this.key("algorithm").use(s), this.key("subjectPrivateKey").octstr());
    }));
    t.PrivateKey = f;
    var c = n.define("EncryptedPrivateKeyInfo", (function() {
        this.seq().obj(this.key("algorithm").seq().obj(this.key("id").objid(), this.key("decrypt").seq().obj(this.key("kde").seq().obj(this.key("id").objid(), this.key("kdeparams").seq().obj(this.key("salt").octstr(), this.key("iters").int())), this.key("cipher").seq().obj(this.key("algo").objid(), this.key("iv").octstr()))), this.key("subjectPrivateKey").octstr());
    }));
    t.EncryptedPrivateKey = c;
    var u = n.define("DSAPrivateKey", (function() {
        this.seq().obj(this.key("version").int(), this.key("p").int(), this.key("q").int(), this.key("g").int(), this.key("pub_key").int(), this.key("priv_key").int());
    }));
    t.DSAPrivateKey = u, t.DSAparam = n.define("DSAparam", (function() {
        this.int();
    }));
    var d = n.define("ECPrivateKey", (function() {
        this.seq().obj(this.key("version").int(), this.key("privateKey").octstr(), this.key("parameters").optional().explicit(0).use(h), this.key("publicKey").optional().explicit(1).bitstr());
    }));
    t.ECPrivateKey = d;
    var h = n.define("ECParameters", (function() {
        this.choice({
            namedCurve: this.objid()
        });
    }));
    t.signature = n.define("signature", (function() {
        this.seq().obj(this.key("r").int(), this.key("s").int());
    }));
}, function(e, t, r) {
    var n = t;
    n.bignum = r(95), n.define = r(139).define, n.base = r(141), n.constants = r(145), 
    n.decoders = r(147), n.encoders = r(150);
}, function(e, t, r) {
    var n = r(138), i = r(17);
    function o(e, t) {
        this.name = e, this.body = t, this.decoders = {}, this.encoders = {};
    }
    t.define = function(e, t) {
        return new o(e, t);
    }, o.prototype._createNamed = function(e) {
        var t;
        try {
            t = r(140).runInThisContext("(function " + this.name + "(entity) {\n  this._initNamed(entity);\n})");
        } catch (e) {
            t = function(e) {
                this._initNamed(e);
            };
        }
        return i(t, e), t.prototype._initNamed = function(t) {
            e.call(this, t);
        }, new t(this);
    }, o.prototype._getDecoder = function(e) {
        return e = e || "der", this.decoders.hasOwnProperty(e) || (this.decoders[e] = this._createNamed(n.decoders[e])), 
        this.decoders[e];
    }, o.prototype.decode = function(e, t, r) {
        return this._getDecoder(t).decode(e, r);
    }, o.prototype._getEncoder = function(e) {
        return e = e || "der", this.encoders.hasOwnProperty(e) || (this.encoders[e] = this._createNamed(n.encoders[e])), 
        this.encoders[e];
    }, o.prototype.encode = function(e, t, r) {
        return this._getEncoder(t).encode(e, r);
    };
}, function(module, exports) {
    var indexOf = function(e, t) {
        if (e.indexOf) return e.indexOf(t);
        for (var r = 0; r < e.length; r++) if (e[r] === t) return r;
        return -1;
    }, Object_keys = function(e) {
        if (Object.keys) return Object.keys(e);
        var t = [];
        for (var r in e) t.push(r);
        return t;
    }, forEach = function(e, t) {
        if (e.forEach) return e.forEach(t);
        for (var r = 0; r < e.length; r++) t(e[r], r, e);
    }, defineProp = function() {
        try {
            return Object.defineProperty({}, "_", {}), function(e, t, r) {
                Object.defineProperty(e, t, {
                    writable: !0,
                    enumerable: !1,
                    configurable: !0,
                    value: r
                });
            };
        } catch (e) {
            return function(e, t, r) {
                e[t] = r;
            };
        }
    }(), globals = [ "Array", "Boolean", "Date", "Error", "EvalError", "Function", "Infinity", "JSON", "Math", "NaN", "Number", "Object", "RangeError", "ReferenceError", "RegExp", "String", "SyntaxError", "TypeError", "URIError", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "undefined", "unescape" ];
    function Context() {}
    Context.prototype = {};
    var Script = exports.Script = function(e) {
        if (!(this instanceof Script)) return new Script(e);
        this.code = e;
    };
    Script.prototype.runInContext = function(e) {
        if (!(e instanceof Context)) throw new TypeError("needs a 'context' argument.");
        var t = document.createElement("iframe");
        t.style || (t.style = {}), t.style.display = "none", document.body.appendChild(t);
        var r = t.contentWindow, n = r.eval, i = r.execScript;
        !n && i && (i.call(r, "null"), n = r.eval), forEach(Object_keys(e), (function(t) {
            r[t] = e[t];
        })), forEach(globals, (function(t) {
            e[t] && (r[t] = e[t]);
        }));
        var o = Object_keys(r), a = n.call(r, this.code);
        return forEach(Object_keys(r), (function(t) {
            (t in e || -1 === indexOf(o, t)) && (e[t] = r[t]);
        })), forEach(globals, (function(t) {
            t in e || defineProp(e, t, r[t]);
        })), document.body.removeChild(t), a;
    }, Script.prototype.runInThisContext = function() {
        return eval(this.code);
    }, Script.prototype.runInNewContext = function(e) {
        var t = Script.createContext(e), r = this.runInContext(t);
        return e && forEach(Object_keys(t), (function(r) {
            e[r] = t[r];
        })), r;
    }, forEach(Object_keys(Script.prototype), (function(e) {
        exports[e] = Script[e] = function(t) {
            var r = Script(t);
            return r[e].apply(r, [].slice.call(arguments, 1));
        };
    })), exports.isContext = function(e) {
        return e instanceof Context;
    }, exports.createScript = function(e) {
        return exports.Script(e);
    }, exports.createContext = Script.createContext = function(e) {
        var t = new Context;
        return "object" == typeof e && forEach(Object_keys(e), (function(r) {
            t[r] = e[r];
        })), t;
    };
}, function(e, t, r) {
    var n = t;
    n.Reporter = r(142).Reporter, n.DecoderBuffer = r(143).DecoderBuffer, n.EncoderBuffer = r(143).EncoderBuffer, 
    n.Node = r(144);
}, function(e, t, r) {
    var n = r(17);
    function i(e) {
        this._reporterState = {
            obj: null,
            path: [],
            options: e || {},
            errors: []
        };
    }
    function o(e, t) {
        this.path = e, this.rethrow(t);
    }
    t.Reporter = i, i.prototype.isError = function(e) {
        return e instanceof o;
    }, i.prototype.save = function() {
        var e = this._reporterState;
        return {
            obj: e.obj,
            pathLen: e.path.length
        };
    }, i.prototype.restore = function(e) {
        var t = this._reporterState;
        t.obj = e.obj, t.path = t.path.slice(0, e.pathLen);
    }, i.prototype.enterKey = function(e) {
        return this._reporterState.path.push(e);
    }, i.prototype.exitKey = function(e) {
        var t = this._reporterState;
        t.path = t.path.slice(0, e - 1);
    }, i.prototype.leaveKey = function(e, t, r) {
        var n = this._reporterState;
        this.exitKey(e), null !== n.obj && (n.obj[t] = r);
    }, i.prototype.path = function() {
        return this._reporterState.path.join("/");
    }, i.prototype.enterObject = function() {
        var e = this._reporterState, t = e.obj;
        return e.obj = {}, t;
    }, i.prototype.leaveObject = function(e) {
        var t = this._reporterState, r = t.obj;
        return t.obj = e, r;
    }, i.prototype.error = function(e) {
        var t, r = this._reporterState, n = e instanceof o;
        if (t = n ? e : new o(r.path.map((function(e) {
            return "[" + JSON.stringify(e) + "]";
        })).join(""), e.message || e, e.stack), !r.options.partial) throw t;
        return n || r.errors.push(t), t;
    }, i.prototype.wrapResult = function(e) {
        var t = this._reporterState;
        return t.options.partial ? {
            result: this.isError(e) ? null : e,
            errors: t.errors
        } : e;
    }, n(o, Error), o.prototype.rethrow = function(e) {
        if (this.message = e + " at: " + (this.path || "(shallow)"), Error.captureStackTrace && Error.captureStackTrace(this, o), 
        !this.stack) try {
            throw new Error(this.message);
        } catch (e) {
            this.stack = e.stack;
        }
        return this;
    };
}, function(e, t, r) {
    var n = r(17), i = r(141).Reporter, o = r(12).Buffer;
    function a(e, t) {
        i.call(this, t), o.isBuffer(e) ? (this.base = e, this.offset = 0, this.length = e.length) : this.error("Input not Buffer");
    }
    function s(e, t) {
        if (Array.isArray(e)) this.length = 0, this.value = e.map((function(e) {
            return e instanceof s || (e = new s(e, t)), this.length += e.length, e;
        }), this); else if ("number" == typeof e) {
            if (!(0 <= e && e <= 255)) return t.error("non-byte EncoderBuffer value");
            this.value = e, this.length = 1;
        } else if ("string" == typeof e) this.value = e, this.length = o.byteLength(e); else {
            if (!o.isBuffer(e)) return t.error("Unsupported type: " + typeof e);
            this.value = e, this.length = e.length;
        }
    }
    n(a, i), t.DecoderBuffer = a, a.prototype.save = function() {
        return {
            offset: this.offset,
            reporter: i.prototype.save.call(this)
        };
    }, a.prototype.restore = function(e) {
        var t = new a(this.base);
        return t.offset = e.offset, t.length = this.offset, this.offset = e.offset, i.prototype.restore.call(this, e.reporter), 
        t;
    }, a.prototype.isEmpty = function() {
        return this.offset === this.length;
    }, a.prototype.readUInt8 = function(e) {
        return this.offset + 1 <= this.length ? this.base.readUInt8(this.offset++, !0) : this.error(e || "DecoderBuffer overrun");
    }, a.prototype.skip = function(e, t) {
        if (!(this.offset + e <= this.length)) return this.error(t || "DecoderBuffer overrun");
        var r = new a(this.base);
        return r._reporterState = this._reporterState, r.offset = this.offset, r.length = this.offset + e, 
        this.offset += e, r;
    }, a.prototype.raw = function(e) {
        return this.base.slice(e ? e.offset : this.offset, this.length);
    }, t.EncoderBuffer = s, s.prototype.join = function(e, t) {
        return e || (e = new o(this.length)), t || (t = 0), 0 === this.length || (Array.isArray(this.value) ? this.value.forEach((function(r) {
            r.join(e, t), t += r.length;
        })) : ("number" == typeof this.value ? e[t] = this.value : "string" == typeof this.value ? e.write(this.value, t) : o.isBuffer(this.value) && this.value.copy(e, t), 
        t += this.length)), e;
    };
}, function(e, t, r) {
    var n = r(141).Reporter, i = r(141).EncoderBuffer, o = r(141).DecoderBuffer, a = r(69), s = [ "seq", "seqof", "set", "setof", "objid", "bool", "gentime", "utctime", "null_", "enum", "int", "objDesc", "bitstr", "bmpstr", "charstr", "genstr", "graphstr", "ia5str", "iso646str", "numstr", "octstr", "printstr", "t61str", "unistr", "utf8str", "videostr" ], f = [ "key", "obj", "use", "optional", "explicit", "implicit", "def", "choice", "any", "contains" ].concat(s);
    function c(e, t) {
        var r = {};
        this._baseState = r, r.enc = e, r.parent = t || null, r.children = null, r.tag = null, 
        r.args = null, r.reverseArgs = null, r.choice = null, r.optional = !1, r.any = !1, 
        r.obj = !1, r.use = null, r.useDecoder = null, r.key = null, r.default = null, r.explicit = null, 
        r.implicit = null, r.contains = null, r.parent || (r.children = [], this._wrap());
    }
    e.exports = c;
    var u = [ "enc", "parent", "children", "tag", "args", "reverseArgs", "choice", "optional", "any", "obj", "use", "alteredUse", "key", "default", "explicit", "implicit", "contains" ];
    c.prototype.clone = function() {
        var e = this._baseState, t = {};
        u.forEach((function(r) {
            t[r] = e[r];
        }));
        var r = new this.constructor(t.parent);
        return r._baseState = t, r;
    }, c.prototype._wrap = function() {
        var e = this._baseState;
        f.forEach((function(t) {
            this[t] = function() {
                var r = new this.constructor(this);
                return e.children.push(r), r[t].apply(r, arguments);
            };
        }), this);
    }, c.prototype._init = function(e) {
        var t = this._baseState;
        a(null === t.parent), e.call(this), t.children = t.children.filter((function(e) {
            return e._baseState.parent === this;
        }), this), a.equal(t.children.length, 1, "Root node can have only one child");
    }, c.prototype._useArgs = function(e) {
        var t = this._baseState, r = e.filter((function(e) {
            return e instanceof this.constructor;
        }), this);
        e = e.filter((function(e) {
            return !(e instanceof this.constructor);
        }), this), 0 !== r.length && (a(null === t.children), t.children = r, r.forEach((function(e) {
            e._baseState.parent = this;
        }), this)), 0 !== e.length && (a(null === t.args), t.args = e, t.reverseArgs = e.map((function(e) {
            if ("object" != typeof e || e.constructor !== Object) return e;
            var t = {};
            return Object.keys(e).forEach((function(r) {
                r == (0 | r) && (r |= 0);
                var n = e[r];
                t[n] = r;
            })), t;
        })));
    }, [ "_peekTag", "_decodeTag", "_use", "_decodeStr", "_decodeObjid", "_decodeTime", "_decodeNull", "_decodeInt", "_decodeBool", "_decodeList", "_encodeComposite", "_encodeStr", "_encodeObjid", "_encodeTime", "_encodeNull", "_encodeInt", "_encodeBool" ].forEach((function(e) {
        c.prototype[e] = function() {
            var t = this._baseState;
            throw new Error(e + " not implemented for encoding: " + t.enc);
        };
    })), s.forEach((function(e) {
        c.prototype[e] = function() {
            var t = this._baseState, r = Array.prototype.slice.call(arguments);
            return a(null === t.tag), t.tag = e, this._useArgs(r), this;
        };
    })), c.prototype.use = function(e) {
        a(e);
        var t = this._baseState;
        return a(null === t.use), t.use = e, this;
    }, c.prototype.optional = function() {
        return this._baseState.optional = !0, this;
    }, c.prototype.def = function(e) {
        var t = this._baseState;
        return a(null === t.default), t.default = e, t.optional = !0, this;
    }, c.prototype.explicit = function(e) {
        var t = this._baseState;
        return a(null === t.explicit && null === t.implicit), t.explicit = e, this;
    }, c.prototype.implicit = function(e) {
        var t = this._baseState;
        return a(null === t.explicit && null === t.implicit), t.implicit = e, this;
    }, c.prototype.obj = function() {
        var e = this._baseState, t = Array.prototype.slice.call(arguments);
        return e.obj = !0, 0 !== t.length && this._useArgs(t), this;
    }, c.prototype.key = function(e) {
        var t = this._baseState;
        return a(null === t.key), t.key = e, this;
    }, c.prototype.any = function() {
        return this._baseState.any = !0, this;
    }, c.prototype.choice = function(e) {
        var t = this._baseState;
        return a(null === t.choice), t.choice = e, this._useArgs(Object.keys(e).map((function(t) {
            return e[t];
        }))), this;
    }, c.prototype.contains = function(e) {
        var t = this._baseState;
        return a(null === t.use), t.contains = e, this;
    }, c.prototype._decode = function(e, t) {
        var r = this._baseState;
        if (null === r.parent) return e.wrapResult(r.children[0]._decode(e, t));
        var n, i = r.default, a = !0, s = null;
        if (null !== r.key && (s = e.enterKey(r.key)), r.optional) {
            var f = null;
            if (null !== r.explicit ? f = r.explicit : null !== r.implicit ? f = r.implicit : null !== r.tag && (f = r.tag), 
            null !== f || r.any) {
                if (a = this._peekTag(e, f, r.any), e.isError(a)) return a;
            } else {
                var c = e.save();
                try {
                    null === r.choice ? this._decodeGeneric(r.tag, e, t) : this._decodeChoice(e, t), 
                    a = !0;
                } catch (e) {
                    a = !1;
                }
                e.restore(c);
            }
        }
        if (r.obj && a && (n = e.enterObject()), a) {
            if (null !== r.explicit) {
                var u = this._decodeTag(e, r.explicit);
                if (e.isError(u)) return u;
                e = u;
            }
            var d = e.offset;
            if (null === r.use && null === r.choice) {
                if (r.any) c = e.save();
                var h = this._decodeTag(e, null !== r.implicit ? r.implicit : r.tag, r.any);
                if (e.isError(h)) return h;
                r.any ? i = e.raw(c) : e = h;
            }
            if (t && t.track && null !== r.tag && t.track(e.path(), d, e.length, "tagged"), 
            t && t.track && null !== r.tag && t.track(e.path(), e.offset, e.length, "content"), 
            i = r.any ? i : null === r.choice ? this._decodeGeneric(r.tag, e, t) : this._decodeChoice(e, t), 
            e.isError(i)) return i;
            if (r.any || null !== r.choice || null === r.children || r.children.forEach((function(r) {
                r._decode(e, t);
            })), r.contains && ("octstr" === r.tag || "bitstr" === r.tag)) {
                var l = new o(i);
                i = this._getUse(r.contains, e._reporterState.obj)._decode(l, t);
            }
        }
        return r.obj && a && (i = e.leaveObject(n)), null === r.key || null === i && !0 !== a ? null !== s && e.exitKey(s) : e.leaveKey(s, r.key, i), 
        i;
    }, c.prototype._decodeGeneric = function(e, t, r) {
        var n = this._baseState;
        return "seq" === e || "set" === e ? null : "seqof" === e || "setof" === e ? this._decodeList(t, e, n.args[0], r) : /str$/.test(e) ? this._decodeStr(t, e, r) : "objid" === e && n.args ? this._decodeObjid(t, n.args[0], n.args[1], r) : "objid" === e ? this._decodeObjid(t, null, null, r) : "gentime" === e || "utctime" === e ? this._decodeTime(t, e, r) : "null_" === e ? this._decodeNull(t, r) : "bool" === e ? this._decodeBool(t, r) : "objDesc" === e ? this._decodeStr(t, e, r) : "int" === e || "enum" === e ? this._decodeInt(t, n.args && n.args[0], r) : null !== n.use ? this._getUse(n.use, t._reporterState.obj)._decode(t, r) : t.error("unknown tag: " + e);
    }, c.prototype._getUse = function(e, t) {
        var r = this._baseState;
        return r.useDecoder = this._use(e, t), a(null === r.useDecoder._baseState.parent), 
        r.useDecoder = r.useDecoder._baseState.children[0], r.implicit !== r.useDecoder._baseState.implicit && (r.useDecoder = r.useDecoder.clone(), 
        r.useDecoder._baseState.implicit = r.implicit), r.useDecoder;
    }, c.prototype._decodeChoice = function(e, t) {
        var r = this._baseState, n = null, i = !1;
        return Object.keys(r.choice).some((function(o) {
            var a = e.save(), s = r.choice[o];
            try {
                var f = s._decode(e, t);
                if (e.isError(f)) return !1;
                n = {
                    type: o,
                    value: f
                }, i = !0;
            } catch (t) {
                return e.restore(a), !1;
            }
            return !0;
        }), this), i ? n : e.error("Choice not matched");
    }, c.prototype._createEncoderBuffer = function(e) {
        return new i(e, this.reporter);
    }, c.prototype._encode = function(e, t, r) {
        var n = this._baseState;
        if (null === n.default || n.default !== e) {
            var i = this._encodeValue(e, t, r);
            if (void 0 !== i && !this._skipDefault(i, t, r)) return i;
        }
    }, c.prototype._encodeValue = function(e, t, r) {
        var i = this._baseState;
        if (null === i.parent) return i.children[0]._encode(e, t || new n);
        var o = null;
        if (this.reporter = t, i.optional && void 0 === e) {
            if (null === i.default) return;
            e = i.default;
        }
        var a = null, s = !1;
        if (i.any) o = this._createEncoderBuffer(e); else if (i.choice) o = this._encodeChoice(e, t); else if (i.contains) a = this._getUse(i.contains, r)._encode(e, t), 
        s = !0; else if (i.children) a = i.children.map((function(r) {
            if ("null_" === r._baseState.tag) return r._encode(null, t, e);
            if (null === r._baseState.key) return t.error("Child should have a key");
            var n = t.enterKey(r._baseState.key);
            if ("object" != typeof e) return t.error("Child expected, but input is not object");
            var i = r._encode(e[r._baseState.key], t, e);
            return t.leaveKey(n), i;
        }), this).filter((function(e) {
            return e;
        })), a = this._createEncoderBuffer(a); else if ("seqof" === i.tag || "setof" === i.tag) {
            if (!i.args || 1 !== i.args.length) return t.error("Too many args for : " + i.tag);
            if (!Array.isArray(e)) return t.error("seqof/setof, but data is not Array");
            var f = this.clone();
            f._baseState.implicit = null, a = this._createEncoderBuffer(e.map((function(r) {
                var n = this._baseState;
                return this._getUse(n.args[0], e)._encode(r, t);
            }), f));
        } else null !== i.use ? o = this._getUse(i.use, r)._encode(e, t) : (a = this._encodePrimitive(i.tag, e), 
        s = !0);
        if (!i.any && null === i.choice) {
            var c = null !== i.implicit ? i.implicit : i.tag, u = null === i.implicit ? "universal" : "context";
            null === c ? null === i.use && t.error("Tag could be omitted only for .use()") : null === i.use && (o = this._encodeComposite(c, s, u, a));
        }
        return null !== i.explicit && (o = this._encodeComposite(i.explicit, !1, "context", o)), 
        o;
    }, c.prototype._encodeChoice = function(e, t) {
        var r = this._baseState, n = r.choice[e.type];
        return n || a(!1, e.type + " not found in " + JSON.stringify(Object.keys(r.choice))), 
        n._encode(e.value, t);
    }, c.prototype._encodePrimitive = function(e, t) {
        var r = this._baseState;
        if (/str$/.test(e)) return this._encodeStr(t, e);
        if ("objid" === e && r.args) return this._encodeObjid(t, r.reverseArgs[0], r.args[1]);
        if ("objid" === e) return this._encodeObjid(t, null, null);
        if ("gentime" === e || "utctime" === e) return this._encodeTime(t, e);
        if ("null_" === e) return this._encodeNull();
        if ("int" === e || "enum" === e) return this._encodeInt(t, r.args && r.reverseArgs[0]);
        if ("bool" === e) return this._encodeBool(t);
        if ("objDesc" === e) return this._encodeStr(t, e);
        throw new Error("Unsupported tag: " + e);
    }, c.prototype._isNumstr = function(e) {
        return /^[0-9 ]*$/.test(e);
    }, c.prototype._isPrintstr = function(e) {
        return /^[A-Za-z0-9 '\(\)\+,\-\.\/:=\?]*$/.test(e);
    };
}, function(e, t, r) {
    var n = t;
    n._reverse = function(e) {
        var t = {};
        return Object.keys(e).forEach((function(r) {
            (0 | r) == r && (r |= 0);
            var n = e[r];
            t[n] = r;
        })), t;
    }, n.der = r(146);
}, function(e, t, r) {
    var n = r(145);
    t.tagClass = {
        0: "universal",
        1: "application",
        2: "context",
        3: "private"
    }, t.tagClassByName = n._reverse(t.tagClass), t.tag = {
        0: "end",
        1: "bool",
        2: "int",
        3: "bitstr",
        4: "octstr",
        5: "null_",
        6: "objid",
        7: "objDesc",
        8: "external",
        9: "real",
        10: "enum",
        11: "embed",
        12: "utf8str",
        13: "relativeOid",
        16: "seq",
        17: "set",
        18: "numstr",
        19: "printstr",
        20: "t61str",
        21: "videostr",
        22: "ia5str",
        23: "utctime",
        24: "gentime",
        25: "graphstr",
        26: "iso646str",
        27: "genstr",
        28: "unistr",
        29: "charstr",
        30: "bmpstr"
    }, t.tagByName = n._reverse(t.tag);
}, function(e, t, r) {
    var n = t;
    n.der = r(148), n.pem = r(149);
}, function(e, t, r) {
    var n = r(17), i = r(138), o = i.base, a = i.bignum, s = i.constants.der;
    function f(e) {
        this.enc = "der", this.name = e.name, this.entity = e, this.tree = new c, this.tree._init(e.body);
    }
    function c(e) {
        o.Node.call(this, "der", e);
    }
    function u(e, t) {
        var r = e.readUInt8(t);
        if (e.isError(r)) return r;
        var n = s.tagClass[r >> 6], i = 0 == (32 & r);
        if (31 == (31 & r)) {
            var o = r;
            for (r = 0; 128 == (128 & o); ) {
                if (o = e.readUInt8(t), e.isError(o)) return o;
                r <<= 7, r |= 127 & o;
            }
        } else r &= 31;
        return {
            cls: n,
            primitive: i,
            tag: r,
            tagStr: s.tag[r]
        };
    }
    function d(e, t, r) {
        var n = e.readUInt8(r);
        if (e.isError(n)) return n;
        if (!t && 128 === n) return null;
        if (0 == (128 & n)) return n;
        var i = 127 & n;
        if (i > 4) return e.error("length octect is too long");
        n = 0;
        for (var o = 0; o < i; o++) {
            n <<= 8;
            var a = e.readUInt8(r);
            if (e.isError(a)) return a;
            n |= a;
        }
        return n;
    }
    e.exports = f, f.prototype.decode = function(e, t) {
        return e instanceof o.DecoderBuffer || (e = new o.DecoderBuffer(e, t)), this.tree._decode(e, t);
    }, n(c, o.Node), c.prototype._peekTag = function(e, t, r) {
        if (e.isEmpty()) return !1;
        var n = e.save(), i = u(e, 'Failed to peek tag: "' + t + '"');
        return e.isError(i) ? i : (e.restore(n), i.tag === t || i.tagStr === t || i.tagStr + "of" === t || r);
    }, c.prototype._decodeTag = function(e, t, r) {
        var n = u(e, 'Failed to decode tag of "' + t + '"');
        if (e.isError(n)) return n;
        var i = d(e, n.primitive, 'Failed to get length of "' + t + '"');
        if (e.isError(i)) return i;
        if (!r && n.tag !== t && n.tagStr !== t && n.tagStr + "of" !== t) return e.error('Failed to match tag: "' + t + '"');
        if (n.primitive || null !== i) return e.skip(i, 'Failed to match body of: "' + t + '"');
        var o = e.save(), a = this._skipUntilEnd(e, 'Failed to skip indefinite length body: "' + this.tag + '"');
        return e.isError(a) ? a : (i = e.offset - o.offset, e.restore(o), e.skip(i, 'Failed to match body of: "' + t + '"'));
    }, c.prototype._skipUntilEnd = function(e, t) {
        for (;;) {
            var r = u(e, t);
            if (e.isError(r)) return r;
            var n, i = d(e, r.primitive, t);
            if (e.isError(i)) return i;
            if (n = r.primitive || null !== i ? e.skip(i) : this._skipUntilEnd(e, t), e.isError(n)) return n;
            if ("end" === r.tagStr) break;
        }
    }, c.prototype._decodeList = function(e, t, r, n) {
        for (var i = []; !e.isEmpty(); ) {
            var o = this._peekTag(e, "end");
            if (e.isError(o)) return o;
            var a = r.decode(e, "der", n);
            if (e.isError(a) && o) break;
            i.push(a);
        }
        return i;
    }, c.prototype._decodeStr = function(e, t) {
        if ("bitstr" === t) {
            var r = e.readUInt8();
            return e.isError(r) ? r : {
                unused: r,
                data: e.raw()
            };
        }
        if ("bmpstr" === t) {
            var n = e.raw();
            if (n.length % 2 == 1) return e.error("Decoding of string type: bmpstr length mismatch");
            for (var i = "", o = 0; o < n.length / 2; o++) i += String.fromCharCode(n.readUInt16BE(2 * o));
            return i;
        }
        if ("numstr" === t) {
            var a = e.raw().toString("ascii");
            return this._isNumstr(a) ? a : e.error("Decoding of string type: numstr unsupported characters");
        }
        if ("octstr" === t) return e.raw();
        if ("objDesc" === t) return e.raw();
        if ("printstr" === t) {
            var s = e.raw().toString("ascii");
            return this._isPrintstr(s) ? s : e.error("Decoding of string type: printstr unsupported characters");
        }
        return /str$/.test(t) ? e.raw().toString() : e.error("Decoding of string type: " + t + " unsupported");
    }, c.prototype._decodeObjid = function(e, t, r) {
        for (var n, i = [], o = 0; !e.isEmpty(); ) {
            var a = e.readUInt8();
            o <<= 7, o |= 127 & a, 0 == (128 & a) && (i.push(o), o = 0);
        }
        128 & a && i.push(o);
        var s = i[0] / 40 | 0, f = i[0] % 40;
        if (n = r ? i : [ s, f ].concat(i.slice(1)), t) {
            var c = t[n.join(" ")];
            void 0 === c && (c = t[n.join(".")]), void 0 !== c && (n = c);
        }
        return n;
    }, c.prototype._decodeTime = function(e, t) {
        var r = e.raw().toString();
        if ("gentime" === t) var n = 0 | r.slice(0, 4), i = 0 | r.slice(4, 6), o = 0 | r.slice(6, 8), a = 0 | r.slice(8, 10), s = 0 | r.slice(10, 12), f = 0 | r.slice(12, 14); else {
            if ("utctime" !== t) return e.error("Decoding " + t + " time is not supported yet");
            n = 0 | r.slice(0, 2), i = 0 | r.slice(2, 4), o = 0 | r.slice(4, 6), a = 0 | r.slice(6, 8), 
            s = 0 | r.slice(8, 10), f = 0 | r.slice(10, 12);
            n = n < 70 ? 2e3 + n : 1900 + n;
        }
        return Date.UTC(n, i - 1, o, a, s, f, 0);
    }, c.prototype._decodeNull = function(e) {
        return null;
    }, c.prototype._decodeBool = function(e) {
        var t = e.readUInt8();
        return e.isError(t) ? t : 0 !== t;
    }, c.prototype._decodeInt = function(e, t) {
        var r = e.raw(), n = new a(r);
        return t && (n = t[n.toString(10)] || n), n;
    }, c.prototype._use = function(e, t) {
        return "function" == typeof e && (e = e(t)), e._getDecoder("der").tree;
    };
}, function(e, t, r) {
    var n = r(17), i = r(12).Buffer, o = r(148);
    function a(e) {
        o.call(this, e), this.enc = "pem";
    }
    n(a, o), e.exports = a, a.prototype.decode = function(e, t) {
        for (var r = e.toString().split(/[\r\n]+/g), n = t.label.toUpperCase(), a = /^-----(BEGIN|END) ([^-]+)-----$/, s = -1, f = -1, c = 0; c < r.length; c++) {
            var u = r[c].match(a);
            if (null !== u && u[2] === n) {
                if (-1 !== s) {
                    if ("END" !== u[1]) break;
                    f = c;
                    break;
                }
                if ("BEGIN" !== u[1]) break;
                s = c;
            }
        }
        if (-1 === s || -1 === f) throw new Error("PEM section not found for: " + n);
        var d = r.slice(s + 1, f).join("");
        d.replace(/[^a-z0-9\+\/=]+/gi, "");
        var h = new i(d, "base64");
        return o.prototype.decode.call(this, h, t);
    };
}, function(e, t, r) {
    var n = t;
    n.der = r(151), n.pem = r(152);
}, function(e, t, r) {
    var n = r(17), i = r(12).Buffer, o = r(138), a = o.base, s = o.constants.der;
    function f(e) {
        this.enc = "der", this.name = e.name, this.entity = e, this.tree = new c, this.tree._init(e.body);
    }
    function c(e) {
        a.Node.call(this, "der", e);
    }
    function u(e) {
        return e < 10 ? "0" + e : e;
    }
    e.exports = f, f.prototype.encode = function(e, t) {
        return this.tree._encode(e, t).join();
    }, n(c, a.Node), c.prototype._encodeComposite = function(e, t, r, n) {
        var o, a = function(e, t, r, n) {
            var i;
            "seqof" === e ? e = "seq" : "setof" === e && (e = "set");
            if (s.tagByName.hasOwnProperty(e)) i = s.tagByName[e]; else {
                if ("number" != typeof e || (0 | e) !== e) return n.error("Unknown tag: " + e);
                i = e;
            }
            if (i >= 31) return n.error("Multi-octet tag encoding unsupported");
            t || (i |= 32);
            return i |= s.tagClassByName[r || "universal"] << 6;
        }(e, t, r, this.reporter);
        if (n.length < 128) return (o = new i(2))[0] = a, o[1] = n.length, this._createEncoderBuffer([ o, n ]);
        for (var f = 1, c = n.length; c >= 256; c >>= 8) f++;
        (o = new i(2 + f))[0] = a, o[1] = 128 | f;
        c = 1 + f;
        for (var u = n.length; u > 0; c--, u >>= 8) o[c] = 255 & u;
        return this._createEncoderBuffer([ o, n ]);
    }, c.prototype._encodeStr = function(e, t) {
        if ("bitstr" === t) return this._createEncoderBuffer([ 0 | e.unused, e.data ]);
        if ("bmpstr" === t) {
            for (var r = new i(2 * e.length), n = 0; n < e.length; n++) r.writeUInt16BE(e.charCodeAt(n), 2 * n);
            return this._createEncoderBuffer(r);
        }
        return "numstr" === t ? this._isNumstr(e) ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: numstr supports only digits and space") : "printstr" === t ? this._isPrintstr(e) ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: printstr supports only latin upper and lower case letters, digits, space, apostrophe, left and rigth parenthesis, plus sign, comma, hyphen, dot, slash, colon, equal sign, question mark") : /str$/.test(t) || "objDesc" === t ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: " + t + " unsupported");
    }, c.prototype._encodeObjid = function(e, t, r) {
        if ("string" == typeof e) {
            if (!t) return this.reporter.error("string objid given, but no values map found");
            if (!t.hasOwnProperty(e)) return this.reporter.error("objid not found in values map");
            e = t[e].split(/[\s\.]+/g);
            for (var n = 0; n < e.length; n++) e[n] |= 0;
        } else if (Array.isArray(e)) {
            e = e.slice();
            for (n = 0; n < e.length; n++) e[n] |= 0;
        }
        if (!Array.isArray(e)) return this.reporter.error("objid() should be either array or string, got: " + JSON.stringify(e));
        if (!r) {
            if (e[1] >= 40) return this.reporter.error("Second objid identifier OOB");
            e.splice(0, 2, 40 * e[0] + e[1]);
        }
        var o = 0;
        for (n = 0; n < e.length; n++) {
            var a = e[n];
            for (o++; a >= 128; a >>= 7) o++;
        }
        var s = new i(o), f = s.length - 1;
        for (n = e.length - 1; n >= 0; n--) {
            a = e[n];
            for (s[f--] = 127 & a; (a >>= 7) > 0; ) s[f--] = 128 | 127 & a;
        }
        return this._createEncoderBuffer(s);
    }, c.prototype._encodeTime = function(e, t) {
        var r, n = new Date(e);
        return "gentime" === t ? r = [ u(n.getFullYear()), u(n.getUTCMonth() + 1), u(n.getUTCDate()), u(n.getUTCHours()), u(n.getUTCMinutes()), u(n.getUTCSeconds()), "Z" ].join("") : "utctime" === t ? r = [ u(n.getFullYear() % 100), u(n.getUTCMonth() + 1), u(n.getUTCDate()), u(n.getUTCHours()), u(n.getUTCMinutes()), u(n.getUTCSeconds()), "Z" ].join("") : this.reporter.error("Encoding " + t + " time is not supported yet"), 
        this._encodeStr(r, "octstr");
    }, c.prototype._encodeNull = function() {
        return this._createEncoderBuffer("");
    }, c.prototype._encodeInt = function(e, t) {
        if ("string" == typeof e) {
            if (!t) return this.reporter.error("String int or enum given, but no values map");
            if (!t.hasOwnProperty(e)) return this.reporter.error("Values map doesn't contain: " + JSON.stringify(e));
            e = t[e];
        }
        if ("number" != typeof e && !i.isBuffer(e)) {
            var r = e.toArray();
            !e.sign && 128 & r[0] && r.unshift(0), e = new i(r);
        }
        if (i.isBuffer(e)) {
            var n = e.length;
            0 === e.length && n++;
            var o = new i(n);
            return e.copy(o), 0 === e.length && (o[0] = 0), this._createEncoderBuffer(o);
        }
        if (e < 128) return this._createEncoderBuffer(e);
        if (e < 256) return this._createEncoderBuffer([ 0, e ]);
        n = 1;
        for (var a = e; a >= 256; a >>= 8) n++;
        for (a = (o = new Array(n)).length - 1; a >= 0; a--) o[a] = 255 & e, e >>= 8;
        return 128 & o[0] && o.unshift(0), this._createEncoderBuffer(new i(o));
    }, c.prototype._encodeBool = function(e) {
        return this._createEncoderBuffer(e ? 255 : 0);
    }, c.prototype._use = function(e, t) {
        return "function" == typeof e && (e = e(t)), e._getEncoder("der").tree;
    }, c.prototype._skipDefault = function(e, t, r) {
        var n, i = this._baseState;
        if (null === i.default) return !1;
        var o = e.join();
        if (void 0 === i.defaultBuffer && (i.defaultBuffer = this._encodeValue(i.default, t, r).join()), 
        o.length !== i.defaultBuffer.length) return !1;
        for (n = 0; n < o.length; n++) if (o[n] !== i.defaultBuffer[n]) return !1;
        return !0;
    };
}, function(e, t, r) {
    var n = r(17), i = r(151);
    function o(e) {
        i.call(this, e), this.enc = "pem";
    }
    n(o, i), e.exports = o, o.prototype.encode = function(e, t) {
        for (var r = i.prototype.encode.call(this, e).toString("base64"), n = [ "-----BEGIN " + t.label + "-----" ], o = 0; o < r.length; o += 64) n.push(r.slice(o, o + 64));
        return n.push("-----END " + t.label + "-----"), n.join("\n");
    };
}, function(e, t, r) {
    "use strict";
    var n = r(138), i = n.define("Time", (function() {
        this.choice({
            utcTime: this.utctime(),
            generalTime: this.gentime()
        });
    })), o = n.define("AttributeTypeValue", (function() {
        this.seq().obj(this.key("type").objid(), this.key("value").any());
    })), a = n.define("AlgorithmIdentifier", (function() {
        this.seq().obj(this.key("algorithm").objid(), this.key("parameters").optional(), this.key("curve").objid().optional());
    })), s = n.define("SubjectPublicKeyInfo", (function() {
        this.seq().obj(this.key("algorithm").use(a), this.key("subjectPublicKey").bitstr());
    })), f = n.define("RelativeDistinguishedName", (function() {
        this.setof(o);
    })), c = n.define("RDNSequence", (function() {
        this.seqof(f);
    })), u = n.define("Name", (function() {
        this.choice({
            rdnSequence: this.use(c)
        });
    })), d = n.define("Validity", (function() {
        this.seq().obj(this.key("notBefore").use(i), this.key("notAfter").use(i));
    })), h = n.define("Extension", (function() {
        this.seq().obj(this.key("extnID").objid(), this.key("critical").bool().def(!1), this.key("extnValue").octstr());
    })), l = n.define("TBSCertificate", (function() {
        this.seq().obj(this.key("version").explicit(0).int().optional(), this.key("serialNumber").int(), this.key("signature").use(a), this.key("issuer").use(u), this.key("validity").use(d), this.key("subject").use(u), this.key("subjectPublicKeyInfo").use(s), this.key("issuerUniqueID").implicit(1).bitstr().optional(), this.key("subjectUniqueID").implicit(2).bitstr().optional(), this.key("extensions").explicit(3).seqof(h).optional());
    })), p = n.define("X509Certificate", (function() {
        this.seq().obj(this.key("tbsCertificate").use(l), this.key("signatureAlgorithm").use(a), this.key("signatureValue").bitstr());
    }));
    e.exports = p;
}, function(e) {
    e.exports = JSON.parse('{"2.16.840.1.101.3.4.1.1":"aes-128-ecb","2.16.840.1.101.3.4.1.2":"aes-128-cbc","2.16.840.1.101.3.4.1.3":"aes-128-ofb","2.16.840.1.101.3.4.1.4":"aes-128-cfb","2.16.840.1.101.3.4.1.21":"aes-192-ecb","2.16.840.1.101.3.4.1.22":"aes-192-cbc","2.16.840.1.101.3.4.1.23":"aes-192-ofb","2.16.840.1.101.3.4.1.24":"aes-192-cfb","2.16.840.1.101.3.4.1.41":"aes-256-ecb","2.16.840.1.101.3.4.1.42":"aes-256-cbc","2.16.840.1.101.3.4.1.43":"aes-256-ofb","2.16.840.1.101.3.4.1.44":"aes-256-cfb"}');
}, function(e, t, r) {
    var n = /Proc-Type: 4,ENCRYPTED[\n\r]+DEK-Info: AES-((?:128)|(?:192)|(?:256))-CBC,([0-9A-H]+)[\n\r]+([0-9A-z\n\r\+\/\=]+)[\n\r]+/m, i = /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----/m, o = /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----([0-9A-z\n\r\+\/\=]+)-----END \1-----$/m, a = r(90), s = r(73), f = r(11).Buffer;
    e.exports = function(e, t) {
        var r, c = e.toString(), u = c.match(n);
        if (u) {
            var d = "aes" + u[1], h = f.from(u[2], "hex"), l = f.from(u[3].replace(/[\r\n]/g, ""), "base64"), p = a(t, h.slice(0, 8), parseInt(u[1], 10)).key, b = [], m = s.createDecipheriv(d, p, h);
            b.push(m.update(l)), b.push(m.final()), r = f.concat(b);
        } else {
            var g = c.match(o);
            r = new f(g[2].replace(/[\r\n]/g, ""), "base64");
        }
        return {
            tag: c.match(i)[1],
            data: r
        };
    };
}, function(e) {
    e.exports = JSON.parse('{"1.3.132.0.10":"secp256k1","1.3.132.0.33":"p224","1.2.840.10045.3.1.1":"p192","1.2.840.10045.3.1.7":"p256","1.3.132.0.34":"p384","1.3.132.0.35":"p521"}');
}, function(e, t, r) {
    (function(t) {
        var n = r(95), i = r(106).ec, o = r(136), a = r(156);
        function s(e, t) {
            if (e.cmpn(0) <= 0) throw new Error("invalid sig");
            if (e.cmp(t) >= t) throw new Error("invalid sig");
        }
        e.exports = function(e, r, f, c, u) {
            var d = o(f);
            if ("ec" === d.type) {
                if ("ecdsa" !== c && "ecdsa/rsa" !== c) throw new Error("wrong public key type");
                return function(e, t, r) {
                    var n = a[r.data.algorithm.curve.join(".")];
                    if (!n) throw new Error("unknown curve " + r.data.algorithm.curve.join("."));
                    var o = new i(n), s = r.data.subjectPrivateKey.data;
                    return o.verify(t, e, s);
                }(e, r, d);
            }
            if ("dsa" === d.type) {
                if ("dsa" !== c) throw new Error("wrong public key type");
                return function(e, t, r) {
                    var i = r.data.p, a = r.data.q, f = r.data.g, c = r.data.pub_key, u = o.signature.decode(e, "der"), d = u.s, h = u.r;
                    s(d, a), s(h, a);
                    var l = n.mont(i), p = d.invm(a);
                    return 0 === f.toRed(l).redPow(new n(t).mul(p).mod(a)).fromRed().mul(c.toRed(l).redPow(h.mul(p).mod(a)).fromRed()).mod(i).mod(a).cmp(h);
                }(e, r, d);
            }
            if ("rsa" !== c && "ecdsa/rsa" !== c) throw new Error("wrong public key type");
            r = t.concat([ u, r ]);
            for (var h = d.modulus.byteLength(), l = [ 1 ], p = 0; r.length + l.length + 2 < h; ) l.push(255), 
            p++;
            l.push(0);
            for (var b = -1; ++b < r.length; ) l.push(r[b]);
            l = new t(l);
            var m = n.mont(d.modulus);
            e = (e = new n(e).toRed(m)).redPow(new n(d.publicExponent)), e = new t(e.fromRed().toArray());
            var g = p < 8 ? 1 : 0;
            for (h = Math.min(e.length, l.length), e.length !== l.length && (g = 1), b = -1; ++b < h; ) g |= e[b] ^ l[b];
            return 0 === g;
        };
    }).call(this, r(12).Buffer);
}, function(e, t, r) {
    (function(t) {
        var n = r(106), i = r(95);
        e.exports = function(e) {
            return new a(e);
        };
        var o = {
            secp256k1: {
                name: "secp256k1",
                byteLength: 32
            },
            secp224r1: {
                name: "p224",
                byteLength: 28
            },
            prime256v1: {
                name: "p256",
                byteLength: 32
            },
            prime192v1: {
                name: "p192",
                byteLength: 24
            },
            ed25519: {
                name: "ed25519",
                byteLength: 32
            },
            secp384r1: {
                name: "p384",
                byteLength: 48
            },
            secp521r1: {
                name: "p521",
                byteLength: 66
            }
        };
        function a(e) {
            this.curveType = o[e], this.curveType || (this.curveType = {
                name: e
            }), this.curve = new n.ec(this.curveType.name), this.keys = void 0;
        }
        function s(e, r, n) {
            Array.isArray(e) || (e = e.toArray());
            var i = new t(e);
            if (n && i.length < n) {
                var o = new t(n - i.length);
                o.fill(0), i = t.concat([ o, i ]);
            }
            return r ? i.toString(r) : i;
        }
        o.p224 = o.secp224r1, o.p256 = o.secp256r1 = o.prime256v1, o.p192 = o.secp192r1 = o.prime192v1, 
        o.p384 = o.secp384r1, o.p521 = o.secp521r1, a.prototype.generateKeys = function(e, t) {
            return this.keys = this.curve.genKeyPair(), this.getPublicKey(e, t);
        }, a.prototype.computeSecret = function(e, r, n) {
            return r = r || "utf8", t.isBuffer(e) || (e = new t(e, r)), s(this.curve.keyFromPublic(e).getPublic().mul(this.keys.getPrivate()).getX(), n, this.curveType.byteLength);
        }, a.prototype.getPublicKey = function(e, t) {
            var r = this.keys.getPublic("compressed" === t, !0);
            return "hybrid" === t && (r[r.length - 1] % 2 ? r[0] = 7 : r[0] = 6), s(r, e);
        }, a.prototype.getPrivateKey = function(e) {
            return s(this.keys.getPrivate(), e);
        }, a.prototype.setPublicKey = function(e, r) {
            return r = r || "utf8", t.isBuffer(e) || (e = new t(e, r)), this.keys._importPublic(e), 
            this;
        }, a.prototype.setPrivateKey = function(e, r) {
            r = r || "utf8", t.isBuffer(e) || (e = new t(e, r));
            var n = new i(e);
            return n = n.toString(16), this.keys = this.curve.genKeyPair(), this.keys._importPrivate(n), 
            this;
        };
    }).call(this, r(12).Buffer);
}, function(e, t, r) {
    t.publicEncrypt = r(160), t.privateDecrypt = r(164), t.privateEncrypt = function(e, r) {
        return t.publicEncrypt(e, r, !0);
    }, t.publicDecrypt = function(e, r) {
        return t.privateDecrypt(e, r, !0);
    };
}, function(e, t, r) {
    var n = r(136), i = r(9), o = r(16), a = r(161), s = r(162), f = r(95), c = r(163), u = r(105), d = r(11).Buffer;
    e.exports = function(e, t, r) {
        var h;
        h = e.padding ? e.padding : r ? 1 : 4;
        var l, p = n(e);
        if (4 === h) l = function(e, t) {
            var r = e.modulus.byteLength(), n = t.length, c = o("sha1").update(d.alloc(0)).digest(), u = c.length, h = 2 * u;
            if (n > r - h - 2) throw new Error("message too long");
            var l = d.alloc(r - n - h - 2), p = r - u - 1, b = i(u), m = s(d.concat([ c, l, d.alloc(1, 1), t ], p), a(b, p)), g = s(b, a(m, u));
            return new f(d.concat([ d.alloc(1), g, m ], r));
        }(p, t); else if (1 === h) l = function(e, t, r) {
            var n, o = t.length, a = e.modulus.byteLength();
            if (o > a - 11) throw new Error("message too long");
            n = r ? d.alloc(a - o - 3, 255) : function(e) {
                var t, r = d.allocUnsafe(e), n = 0, o = i(2 * e), a = 0;
                for (;n < e; ) a === o.length && (o = i(2 * e), a = 0), (t = o[a++]) && (r[n++] = t);
                return r;
            }(a - o - 3);
            return new f(d.concat([ d.from([ 0, r ? 1 : 2 ]), n, d.alloc(1), t ], a));
        }(p, t, r); else {
            if (3 !== h) throw new Error("unknown padding");
            if ((l = new f(t)).cmp(p.modulus) >= 0) throw new Error("data too long for modulus");
        }
        return r ? u(l, p) : c(l, p);
    };
}, function(e, t, r) {
    var n = r(16), i = r(11).Buffer;
    function o(e) {
        var t = i.allocUnsafe(4);
        return t.writeUInt32BE(e, 0), t;
    }
    e.exports = function(e, t) {
        for (var r, a = i.alloc(0), s = 0; a.length < t; ) r = o(s++), a = i.concat([ a, n("sha1").update(e).update(r).digest() ]);
        return a.slice(0, t);
    };
}, function(e, t) {
    e.exports = function(e, t) {
        for (var r = e.length, n = -1; ++n < r; ) e[n] ^= t[n];
        return e;
    };
}, function(e, t, r) {
    var n = r(95), i = r(11).Buffer;
    e.exports = function(e, t) {
        return i.from(e.toRed(n.mont(t.modulus)).redPow(new n(t.publicExponent)).fromRed().toArray());
    };
}, function(e, t, r) {
    var n = r(136), i = r(161), o = r(162), a = r(95), s = r(105), f = r(16), c = r(163), u = r(11).Buffer;
    e.exports = function(e, t, r) {
        var d;
        d = e.padding ? e.padding : r ? 1 : 4;
        var h, l = n(e), p = l.modulus.byteLength();
        if (t.length > p || new a(t).cmp(l.modulus) >= 0) throw new Error("decryption error");
        h = r ? c(new a(t), l) : s(t, l);
        var b = u.alloc(p - h.length);
        if (h = u.concat([ b, h ], p), 4 === d) return function(e, t) {
            var r = e.modulus.byteLength(), n = f("sha1").update(u.alloc(0)).digest(), a = n.length;
            if (0 !== t[0]) throw new Error("decryption error");
            var s = t.slice(1, a + 1), c = t.slice(a + 1), d = o(s, i(c, a)), h = o(c, i(d, r - a - 1));
            if (function(e, t) {
                e = u.from(e), t = u.from(t);
                var r = 0, n = e.length;
                e.length !== t.length && (r++, n = Math.min(e.length, t.length));
                var i = -1;
                for (;++i < n; ) r += e[i] ^ t[i];
                return r;
            }(n, h.slice(0, a))) throw new Error("decryption error");
            var l = a;
            for (;0 === h[l]; ) l++;
            if (1 !== h[l++]) throw new Error("decryption error");
            return h.slice(l);
        }(l, h);
        if (1 === d) return function(e, t, r) {
            var n = t.slice(0, 2), i = 2, o = 0;
            for (;0 !== t[i++]; ) if (i >= t.length) {
                o++;
                break;
            }
            var a = t.slice(2, i - 1);
            ("0002" !== n.toString("hex") && !r || "0001" !== n.toString("hex") && r) && o++;
            a.length < 8 && o++;
            if (o) throw new Error("decryption error");
            return t.slice(i);
        }(0, h, r);
        if (3 === d) return h;
        throw new Error("unknown padding");
    };
}, function(e, t, r) {
    "use strict";
    (function(e, n) {
        function i() {
            throw new Error("secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11");
        }
        var o = r(11), a = r(9), s = o.Buffer, f = o.kMaxLength, c = e.crypto || e.msCrypto, u = Math.pow(2, 32) - 1;
        function d(e, t) {
            if ("number" != typeof e || e != e) throw new TypeError("offset must be a number");
            if (e > u || e < 0) throw new TypeError("offset must be a uint32");
            if (e > f || e > t) throw new RangeError("offset out of range");
        }
        function h(e, t, r) {
            if ("number" != typeof e || e != e) throw new TypeError("size must be a number");
            if (e > u || e < 0) throw new TypeError("size must be a uint32");
            if (e + t > r || e > f) throw new RangeError("buffer too small");
        }
        function l(e, t, r, i) {
            if (n.browser) {
                var o = e.buffer, s = new Uint8Array(o, t, r);
                return c.getRandomValues(s), i ? void n.nextTick((function() {
                    i(null, e);
                })) : e;
            }
            if (!i) return a(r).copy(e, t), e;
            a(r, (function(r, n) {
                if (r) return i(r);
                n.copy(e, t), i(null, e);
            }));
        }
        c && c.getRandomValues || !n.browser ? (t.randomFill = function(t, r, n, i) {
            if (!(s.isBuffer(t) || t instanceof e.Uint8Array)) throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
            if ("function" == typeof r) i = r, r = 0, n = t.length; else if ("function" == typeof n) i = n, 
            n = t.length - r; else if ("function" != typeof i) throw new TypeError('"cb" argument must be a function');
            return d(r, t.length), h(n, r, t.length), l(t, r, n, i);
        }, t.randomFillSync = function(t, r, n) {
            void 0 === r && (r = 0);
            if (!(s.isBuffer(t) || t instanceof e.Uint8Array)) throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
            d(r, t.length), void 0 === n && (n = t.length - r);
            return h(n, r, t.length), l(t, r, n);
        }) : (t.randomFill = i, t.randomFillSync = i);
    }).call(this, r(3), r(10));
}, function(e, t) {
    e.exports = {
        parse: function(e) {
            try {
                const t = e.id.substr(3);
                if (1 === e.querySelector(".div_table_radio_question").querySelectorAll("table").length) {
                    const r = e.querySelectorAll(".div_table_radio_question > table > tbody > tr textarea").length;
                    return {
                        type: "bi",
                        elem: e,
                        id: t,
                        meta: {
                            s: !0,
                            l: r
                        }
                    };
                }
            } catch (e) {
                console.error(e);
            }
        },
        get: function(e) {
            try {
                return [ ...e.querySelectorAll(".div_table_radio_question > table > tbody > tr") ].map(e => e.querySelector("textarea").value).join(",");
            } catch (e) {
                return console.error(e), "";
            }
        },
        set: function(e, t) {
            try {
                const r = t.split(",");
                [ ...e.querySelectorAll(".div_table_radio_question > table > tbody > tr") ].forEach((e, t) => {
                    e.querySelector("textarea").value = r[t];
                });
            } catch (e) {
                console.error(e);
            }
        }
    };
}, function(e, t) {
    e.exports = {
        parse: function(e) {
            try {
                const t = e.id.substr(3), r = e.querySelector(".div_table_radio_question");
                if (1 === r.querySelectorAll("select").length) {
                    return {
                        type: "sl",
                        elem: e,
                        id: t,
                        meta: {
                            s: !0,
                            l: r.querySelector("select").childElementCount
                        }
                    };
                }
            } catch (e) {
                console.error(e);
            }
        },
        get: function(e) {
            try {
                const t = e.querySelector(".div_table_radio_question > select").value;
                return parseInt(t) > 0 ? t : "";
            } catch (e) {
                return console.error(e), "";
            }
        },
        set: function(e, t) {
            try {
                e.querySelector(".div_table_radio_question > select").value = t;
            } catch (e) {
                console.error(e);
            }
        }
    };
}, function(e, t, r) {
    const {isSensible: n} = r(169);
    e.exports = {
        parse: function(e) {
            try {
                const t = e.id.substr(3);
                if (1 === e.querySelector(".div_table_radio_question").querySelectorAll("textarea").length) {
                    const r = function(e) {
                        return e.querySelector("textarea").id;
                    }(e), i = e.querySelector(".div_title_question").childNodes[0].textContent, o = n(i), a = [ ...e.querySelector(".div_title_question_all > .div_title_question").childNodes ].filter(e => !("SPAN" === e.tagName && [ "req", "qtypetip" ].some(t => e.classList.contains(t)))).map(e => e.textContent).join("").trim().replace(/(\s+)/g, "");
                    return {
                        type: "t",
                        elem: e,
                        id: t,
                        meta: {
                            i: r,
                            s: o,
                            f: a
                        }
                    };
                }
            } catch (e) {
                console.error(e);
            }
        },
        get: function(e) {
            try {
                return e.querySelector("textarea").value;
            } catch (e) {
                return console.error(e), "";
            }
        },
        set: function(e, t) {
            try {
                const r = t.split("|").map(e => e.trim()), n = r[Math.floor(Math.random() * r.length)];
                e.querySelector("textarea").value = n;
            } catch (e) {
                console.error(e);
            }
        },
        display: function(e, t) {
            try {
                const r = e.querySelector("textarea"), n = document.createElement("textarea");
                n.setAttribute("topic", "fdd-display"), n.value = t, n.readOnly = !0, n.style.width = "100%", 
                r.after(n);
            } catch (e) {
                console.error(e);
            }
        },
        hide: function(e) {
            try {
                const t = e.querySelector('textarea[topic="fdd-display"]');
                t && t.remove();
            } catch (e) {
                console.error(e);
            }
        }
    };
}, function(e, t) {
    const r = [ /(姓名|名字|班级|教学班|行政班)[\s]*([(（].+[)）])?[\s]*(:|：)?$/ ];
    e.exports = {
        isSensible: function(e) {
            return e = e.trim(), r.some(t => t.test(e));
        },
        deleteAllCookies: function() {
            document.cookie.split(";").forEach((function(e) {
                document.cookie = e.replace(/^ +/, "").replace(/=.*/, "=;expires=" + (new Date).toUTCString() + ";path=/");
            }));
        }
    };
}, function(e, t, r) {
    const {isSensible: n} = r(169);
    function i(e) {
        const t = e.querySelector("input");
        return /^(.+)_/.exec(t.id)[1];
    }
    e.exports = {
        parse: function(e) {
            try {
                const t = e.querySelector(".div_table_radio_question"), r = e.id.substr(3);
                if (t.querySelector("a.jqCheckbox") || t.querySelector("a.jqRadio")) {
                    const o = i(e), a = [ ...t.querySelectorAll("ul > li").values() ].map(e => [ e.querySelector("input").id.substr(o.length + 1), e.querySelector("label").textContent.trim() ]).filter(e => e[0]).sort(), s = t.querySelector("a.jqCheckbox") ? 1 : 0, f = e.querySelector(".div_title_question").childNodes[0].textContent, c = n(f), u = [ ...e.querySelector(".div_title_question_all > .div_title_question").childNodes ].filter(e => !("SPAN" === e.tagName && [ "req", "qtypetip" ].some(t => e.classList.contains(t)))).map(e => e.textContent).join("").trim().replace(/(\s+)/g, "");
                    return {
                        type: "c",
                        elem: e,
                        id: r,
                        meta: {
                            o: a,
                            t: s,
                            i: o,
                            s: c,
                            f: u
                        }
                    };
                }
            } catch (e) {
                console.error(e);
            }
        },
        get: function(e) {
            try {
                const t = [ ...e.querySelectorAll("a.jqChecked").values() ];
                if (t.length) {
                    const r = i(e);
                    return t.map(e => e.rel.substr(r.length + 1)).join(",");
                }
                return "";
            } catch (e) {
                return console.error(e), "";
            }
        },
        set: function(e, t) {
            try {
                if (!t) return;
                const r = i(e), n = t.split(",");
                e.querySelectorAll(".div_table_radio_question > ul > li > a.jqCheckbox.jqChecked").forEach(e => e.click());
                for (const t of n) {
                    const n = e.querySelector(`a[rel="${r}_${t}"]`);
                    n && n.click();
                }
            } catch (e) {
                console.error(e);
            }
        },
        display: function(e, t) {
            try {
                if (!t) return;
                const r = i(e), n = t.split(","), o = e.querySelectorAll(".div_table_radio_question > ul > li");
                for (const e of o) e.classList.remove("fdd-cstd");
                for (const t of n) {
                    const n = e.querySelector(`a[rel="${r}_${t}"]`);
                    n && n.parentElement.classList.add("fdd-cstd");
                }
            } catch (e) {
                console.error(e);
            }
        },
        hide: function(e) {
            try {
                const t = e.querySelectorAll(".div_table_radio_question > ul > li");
                for (const e of t) e.classList.remove("fdd-cstd");
            } catch (e) {
                console.error(e);
            }
        }
    };
}, function(e, t, r) {
    const n = r(172);
    e.exports = {
        submit: function(e, t, r, i) {
            if (i) {
                const e = new Date(i);
                unsafeWindow.starttime = n(e, "yyyy/m/d H:MM:ss");
            }
            var o, a, s, f, c, u, d, h, l, p, b, m, g, y, v, w, _, x, S, A, E, M, k;
            if (2 == e || t || validate()) {
                if (submit_tip.innerHTML = validate_info_submit2, o = 1, 0 == e ? PromoteUser("正在处理，请稍候...", 3e3, !0) : 2 == e ? (o = cur_page, 
                hlv = "1") : 3 == e ? PromoteUser("正在验证，请稍候...", 3e3, !0) : (submit_tip.style.display = "block", 
                submit_div.style.display = "none"), needCheckLeave = !1, answer_send = sent_to_answer(e), 
                2 == e && prevsaveanswer == answer_send) return a = "已保存", 1 == langVer && (a = "<div style='font-size:18px;'>&nbsp;&nbsp;Saved</div>"), 
                void (spanSave && (spanSave.innerHTML = a));
                if ((s = getXmlHttp()).onreadystatechange = function() {
                    if (4 == s.readyState) {
                        clearTimeout(timeoutTimer);
                        var t = s.status;
                        200 == t ? (afterSubmit(s.responseText, e), prevsaveanswer = answer_send) : processError(t, e, f);
                    }
                }, f = "submittype=" + e + "&curID=" + activityId + "&t=" + (r || (new Date).valueOf()), 
                source && (f += "&source=" + encodeURIComponent(source)), unsafeWindow.udsid && (f += "&udsid=" + unsafeWindow.udsid), 
                unsafeWindow.fromsour && (f += "&fromsour=" + unsafeWindow.fromsour), nvvv && (f += "&nvvv=1"), 
                unsafeWindow.wxUserId && (f += "&wxUserId=" + unsafeWindow.wxUserId), unsafeWindow.cProvince && (f += "&cp=" + encodeURIComponent(cProvince.replace("'", "")) + "&cc=" + encodeURIComponent(cCity.replace("'", "")) + "&ci=" + escape(cIp), 
                0 == jiFen)) {
                    c = cProvince + "," + cCity;
                    try {
                        setCookie("ip_" + cIp, c, null, "/", "", null);
                    } catch (e) {}
                }
                for (hasTouPiao && (f += "&toupiao=t"), jiFen > 0 && (f += "&jf=" + jiFen), randomparm && (f += "&ranparm=" + randomparm), 
                inviteid && (f += "&inviteid=" + encodeURIComponent(inviteid)), SJBack && (f += "&sjback=1"), 
                unsafeWindow.cpid && (f += "&cpid=" + cpid), 2 == e && (f += "&lastpage=" + o + "&lastq=" + MaxTopic), 
                3 == e && (f += "&zbp=" + (cur_page + 1), needSubmitNotValid && (f += "&nsnv=1")), 
                hasJoin && 0 != e && (f += "&nfjoinid=" + nfjoinid), unsafeWindow.sojumpParm && (u = unsafeWindow.sojumpParm, 
                unsafeWindow.hasEncode || (u = encodeURIComponent(u)), f += "&sojumpparm=" + u), 
                unsafeWindow.parmsign && (f += "&parmsign=" + encodeURIComponent(parmsign)), unsafeWindow.qdataList && qdataList.length > 0 && (f += "&aqsj=" + encodeURIComponent(qdataList.join(""))), 
                tCode && "none" != tCode.style.display && "" != submit_text.value && (f += "&validate_text=" + encodeURIComponent(submit_text.value)), 
                unsafeWindow.useAliVerify && (f += "&nc_csessionid=" + encodeURIComponent(nc_csessionid) + "&nc_sig=" + encodeURIComponent(nc_sig) + "&nc_token=" + encodeURIComponent(nc_token) + "&nc_scene=" + nc_scene + "&validate_text=geet"), 
                f += "&starttime=" + encodeURIComponent(starttime), guid && (f += "&emailguid=" + guid), 
                unsafeWindow.sjUser && (f += "&sjUser=" + encodeURIComponent(sjUser)), unsafeWindow.sjts && (f += "&sjts=" + sjts), 
                unsafeWindow.sjsign && (f += "&sjsign=" + encodeURIComponent(sjsign)), unsafeWindow.FromSj && (f += "&fromsj=1"), 
                unsafeWindow.sourcelink && unsafeWindow.outuser && (f += unsafeWindow.sourcelink, 
                unsafeWindow.outsign && (f += "&outsign=" + encodeURIComponent(outsign))), f += "&ktimes=" + ktimes, 
                unsafeWindow.mobileRnum && (f += "&m=" + unsafeWindow.mobileRnum), unsafeWindow.rndnum && (f += "&rn=" + encodeURIComponent(rndnum)), 
                rName && (d = rName.replace("(", "（").replace(")", "）"), setCookie("jcn" + activityId, d, getExpDate(0, 0, 30), "/", "", null)), 
                unsafeWindow.relts && (f += "&relts=" + relts), unsafeWindow.relusername && (f += "&relusername=" + encodeURIComponent(relusername)), 
                unsafeWindow.relsign && (f += "&relsign=" + encodeURIComponent(relsign)), unsafeWindow.relrealname && (f += "&relrealname=" + encodeURIComponent(relrealname)), 
                unsafeWindow.reldept && (f += "&reldept=" + encodeURIComponent(reldept)), unsafeWindow.relext && (f += "&relext=" + encodeURIComponent(relext)), 
                Password && (f += "&psd=" + encodeURIComponent(Password)), PasswordExt && (f += "&pwdext=" + encodeURIComponent(PasswordExt)), 
                hasMaxtime && (f += "&hmt=1"), unsafeWindow.amt && (f += "&amt=" + amt), f += "&hlv=" + hlv, 
                sourceDetail && (f += "&sd=" + sourceDetail), imgVerify && (f += "&btuserinput=" + encodeURIComponent(submit_text.value), 
                f += "&btcaptchaId=" + encodeURIComponent(imgVerify.captchaId), f += "&btinstanceId=" + encodeURIComponent(imgVerify.instanceId)), 
                unsafeWindow.access_token && unsafeWindow.openid && (f += "&access_token=" + encodeURIComponent(access_token) + "&qqopenid=" + encodeURIComponent(openid)), 
                unsafeWindow.initMaxSurveyTime && (f += "&mst=" + unsafeWindow.initMaxSurveyTime), 
                (h = unsafeWindow.alipayAccount || unsafeWindow.cAlipayAccount) && (f += "&alac=" + encodeURIComponent(h)), 
                shopHT.length > 0 && ((l = document.getElementById("shopcart")) && "none" != l.style.display && (f += "&ishop=1")), 
                modata && setCookie("jcm" + activityId, modata, getExpDate(0, 0, 30), "/", "", null), 
                unsafeWindow.jqnonce && (f += "&jqnonce=" + encodeURIComponent(unsafeWindow.jqnonce), 
                p = dataenc(unsafeWindow.jqnonce), f += "&jqsign=" + encodeURIComponent(p)), GetJpMatch(), 
                jpMatchId && (f += "&jpm=" + jpMatchId), b = encodeURIComponent(answer_send), m = !1, 
                g = "", y = "", v = 0; v < trapHolder.length; v++) {
                    for (g = "", w = trapHolder[v].itemInputs, _ = new Array, x = 0; x < w.length; x++) w[x].checked && _.push(w[x].value);
                    for (_.sort((function(e, t) {
                        return e - t;
                    })), x = 0; x < _.length; x++) g += _[x] + ",";
                    if (S = trapHolder[v].getAttribute("trapanswer"), g && S && -1 == g.indexOf(S)) {
                        m = !0, y = trapHolder[v].getAttribute("tikuindex");
                        break;
                    }
                }
                m && (f += "&ite=1&ics=" + encodeURIComponent(y + ";" + g)), A = !1, E = "post", 
                M = unsafeWindow.getMaxWidth || 1800, unsafeWindow.submitWithGet && b.length <= M && (A = !0), 
                A ? (f += "&submitdata=" + b, f += "&useget=1", E = "get") : unsafeWindow.submitWithGet && (unsafeWindow.postIframe = 1), 
                unsafeWindow.refDepartment && (f += "&rdept=" + encodeURIComponent(unsafeWindow.refDepartmentVal)), 
                unsafeWindow.refUserId && (f += "&ruserid=" + encodeURIComponent(refUserIdVal)), 
                unsafeWindow.deptId && unsafeWindow.corpId && (f += "&deptid=" + deptId + "&corpid=" + corpId), 
                k = "/joinnew/processjq.ashx?" + f, s.open(E, k, !1), s.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), 
                havereturn = !1, unsafeWindow.postIframe ? postWithIframe(k, e) : A ? 2 == errorTimes || unsafeWindow.getWithIframe ? GetWithIframe(k, e, f) : (1 == e && (timeoutTimer = setTimeout((function() {
                    processError("ajaxget", e, f);
                }), 2e4)), s.send(null)) : (1 == e && (timeoutTimer = setTimeout((function() {
                    processError("ajaxpost", e, f);
                }), 2e4)), s.send("submitdata=" + b));
            }
        }
    };
}, function(e, t, r) {
    var n;
    !function(i) {
        "use strict";
        var o, a, s, f = (o = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|"[^"]*"|'[^']*'/g, 
        a = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g, 
        s = /[^-+\dA-Z]/g, function(e, t, r, n) {
            if (1 !== arguments.length || "string" !== h(e) || /\d/.test(e) || (t = e, e = void 0), 
            (e = e || new Date) instanceof Date || (e = new Date(e)), isNaN(e)) throw TypeError("Invalid date");
            var i = (t = String(f.masks[t] || t || f.masks.default)).slice(0, 4);
            "UTC:" !== i && "GMT:" !== i || (t = t.slice(4), r = !0, "GMT:" === i && (n = !0));
            var l = r ? "getUTC" : "get", p = e[l + "Date"](), b = e[l + "Day"](), m = e[l + "Month"](), g = e[l + "FullYear"](), y = e[l + "Hours"](), v = e[l + "Minutes"](), w = e[l + "Seconds"](), _ = e[l + "Milliseconds"](), x = r ? 0 : e.getTimezoneOffset(), S = u(e), A = d(e), E = {
                d: p,
                dd: c(p),
                ddd: f.i18n.dayNames[b],
                dddd: f.i18n.dayNames[b + 7],
                m: m + 1,
                mm: c(m + 1),
                mmm: f.i18n.monthNames[m],
                mmmm: f.i18n.monthNames[m + 12],
                yy: String(g).slice(2),
                yyyy: g,
                h: y % 12 || 12,
                hh: c(y % 12 || 12),
                H: y,
                HH: c(y),
                M: v,
                MM: c(v),
                s: w,
                ss: c(w),
                l: c(_, 3),
                L: c(Math.round(_ / 10)),
                t: y < 12 ? f.i18n.timeNames[0] : f.i18n.timeNames[1],
                tt: y < 12 ? f.i18n.timeNames[2] : f.i18n.timeNames[3],
                T: y < 12 ? f.i18n.timeNames[4] : f.i18n.timeNames[5],
                TT: y < 12 ? f.i18n.timeNames[6] : f.i18n.timeNames[7],
                Z: n ? "GMT" : r ? "UTC" : (String(e).match(a) || [ "" ]).pop().replace(s, ""),
                o: (x > 0 ? "-" : "+") + c(100 * Math.floor(Math.abs(x) / 60) + Math.abs(x) % 60, 4),
                S: [ "th", "st", "nd", "rd" ][p % 10 > 3 ? 0 : (p % 100 - p % 10 != 10) * p % 10],
                W: S,
                N: A
            };
            return t.replace(o, (function(e) {
                return e in E ? E[e] : e.slice(1, e.length - 1);
            }));
        });
        function c(e, t) {
            for (e = String(e), t = t || 2; e.length < t; ) e = "0" + e;
            return e;
        }
        function u(e) {
            var t = new Date(e.getFullYear(), e.getMonth(), e.getDate());
            t.setDate(t.getDate() - (t.getDay() + 6) % 7 + 3);
            var r = new Date(t.getFullYear(), 0, 4);
            r.setDate(r.getDate() - (r.getDay() + 6) % 7 + 3);
            var n = t.getTimezoneOffset() - r.getTimezoneOffset();
            t.setHours(t.getHours() - n);
            var i = (t - r) / 6048e5;
            return 1 + Math.floor(i);
        }
        function d(e) {
            var t = e.getDay();
            return 0 === t && (t = 7), t;
        }
        function h(e) {
            return null === e ? "null" : void 0 === e ? "undefined" : "object" != typeof e ? typeof e : Array.isArray(e) ? "array" : {}.toString.call(e).slice(8, -1).toLowerCase();
        }
        f.masks = {
            default: "ddd mmm dd yyyy HH:MM:ss",
            shortDate: "m/d/yy",
            mediumDate: "mmm d, yyyy",
            longDate: "mmmm d, yyyy",
            fullDate: "dddd, mmmm d, yyyy",
            shortTime: "h:MM TT",
            mediumTime: "h:MM:ss TT",
            longTime: "h:MM:ss TT Z",
            isoDate: "yyyy-mm-dd",
            isoTime: "HH:MM:ss",
            isoDateTime: "yyyy-mm-dd'T'HH:MM:sso",
            isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
            expiresHeaderFormat: "ddd, dd mmm yyyy HH:MM:ss Z"
        }, f.i18n = {
            dayNames: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
            monthNames: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
            timeNames: [ "a", "p", "am", "pm", "A", "P", "AM", "PM" ]
        }, void 0 === (n = function() {
            return f;
        }.call(t, r, t, e)) || (e.exports = n);
    }();
}, function(e, t, r) {
    GM.addStyle(r(174).toString()), GM.addStyle(r(176).toString());
}, function(e, t, r) {
    (t = r(175)(!1)).push([ e.i, ".fdd-cstd{border:1px solid}.fdd-menu-container{opacity:.3;z-index:999;position:fixed;top:0;left:0;transition:.1s;text-align:left}.fdd-menu-opener{z-index:998;position:fixed;bottom:32px;right:32px}@media print{#jqContent{padding-top:0}#box>div:last-child,#submit_div,#toast-container,.fdd-menu-container,.fdd-menu-opener{display:none}}.fdd-menu-container:hover{opacity:1}.fdd-menu-container pre{background-color:#fff;padding:4px;width:-webkit-fit-content;width:-moz-fit-content;width:fit-content}.fdd-menu-container button,.fdd-menu-container pre{margin:2px;border:none;border-radius:2px;box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.12),0 1px 5px 0 rgba(0,0,0,.2)}.fdd-menu-container button{display:inline-block;height:24px;line-height:24px;padding:0 4px;vertical-align:middle;outline:0;text-decoration:none;color:#fff;background-color:#03a9f4;text-align:center;letter-spacing:.5px;transition:background-color .2s ease-out;cursor:pointer}.fdd-menu-container button:focus{background-color:#0288d1}.fdd-menu-container button:hover{background-color:#039be5}", "" ]), 
    e.exports = t;
}, function(e, t, r) {
    "use strict";
    e.exports = function(e) {
        var t = [];
        return t.toString = function() {
            return this.map((function(t) {
                var r = function(e, t) {
                    var r = e[1] || "", n = e[3];
                    if (!n) return r;
                    if (t && "function" == typeof btoa) {
                        var i = (a = n, s = btoa(unescape(encodeURIComponent(JSON.stringify(a)))), f = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(s), 
                        "/*# ".concat(f, " */")), o = n.sources.map((function(e) {
                            return "/*# sourceURL=".concat(n.sourceRoot || "").concat(e, " */");
                        }));
                        return [ r ].concat(o).concat([ i ]).join("\n");
                    }
                    var a, s, f;
                    return [ r ].join("\n");
                }(t, e);
                return t[2] ? "@media ".concat(t[2], " {").concat(r, "}") : r;
            })).join("");
        }, t.i = function(e, r, n) {
            "string" == typeof e && (e = [ [ null, e, "" ] ]);
            var i = {};
            if (n) for (var o = 0; o < this.length; o++) {
                var a = this[o][0];
                null != a && (i[a] = !0);
            }
            for (var s = 0; s < e.length; s++) {
                var f = [].concat(e[s]);
                n && i[f[0]] || (r && (f[2] ? f[2] = "".concat(r, " and ").concat(f[2]) : f[2] = r), 
                t.push(f));
            }
        }, t;
    };
}, function(e, t, r) {
    (t = r(175)(!1)).push([ e.i, ".toast-title{font-weight:700}.toast-message{-ms-word-wrap:break-word;word-wrap:break-word}.toast-message a,.toast-message label{color:#fff}.toast-message a:hover{color:#ccc;text-decoration:none}.toast-close-button{position:relative;right:-.3em;top:-.3em;float:right;font-size:20px;font-weight:700;color:#fff;-webkit-text-shadow:0 1px 0 #fff;text-shadow:0 1px 0 #fff;opacity:.8;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=80);filter:alpha(opacity=80);line-height:1}.toast-close-button:focus,.toast-close-button:hover{color:#000;text-decoration:none;cursor:pointer;opacity:.4;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=40);filter:alpha(opacity=40)}.rtl .toast-close-button{left:-.3em;float:left;right:.3em}button.toast-close-button{padding:0;cursor:pointer;background:0 0;border:0;-webkit-appearance:none}.toast-top-center{top:0;right:0;width:100%}.toast-bottom-center{bottom:0;right:0;width:100%}.toast-top-full-width{top:0;right:0;width:100%}.toast-bottom-full-width{bottom:0;right:0;width:100%}.toast-top-left{top:12px;left:12px}.toast-top-right{top:12px;right:12px}.toast-bottom-right{right:12px;bottom:12px}.toast-bottom-left{bottom:12px;left:12px}#toast-container{position:fixed;z-index:999999;pointer-events:none}#toast-container *{box-sizing:border-box}#toast-container>div{position:relative;pointer-events:auto;overflow:hidden;margin:0 0 6px;padding:15px 15px 15px 50px;width:300px;border-radius:3px;background-position:15px;background-repeat:no-repeat;box-shadow:0 0 12px #999;color:#fff;opacity:.8;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=80);filter:alpha(opacity=80)}#toast-container>div.rtl{direction:rtl;padding:15px 50px 15px 15px;background-position:right 15px center}#toast-container>div:hover{box-shadow:0 0 12px #000;opacity:1;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=100);filter:alpha(opacity=100);cursor:pointer}#toast-container>.toast-info{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGwSURBVEhLtZa9SgNBEMc9sUxxRcoUKSzSWIhXpFMhhYWFhaBg4yPYiWCXZxBLERsLRS3EQkEfwCKdjWJAwSKCgoKCcudv4O5YLrt7EzgXhiU3/4+b2ckmwVjJSpKkQ6wAi4gwhT+z3wRBcEz0yjSseUTrcRyfsHsXmD0AmbHOC9Ii8VImnuXBPglHpQ5wwSVM7sNnTG7Za4JwDdCjxyAiH3nyA2mtaTJufiDZ5dCaqlItILh1NHatfN5skvjx9Z38m69CgzuXmZgVrPIGE763Jx9qKsRozWYw6xOHdER+nn2KkO+Bb+UV5CBN6WC6QtBgbRVozrahAbmm6HtUsgtPC19tFdxXZYBOfkbmFJ1VaHA1VAHjd0pp70oTZzvR+EVrx2Ygfdsq6eu55BHYR8hlcki+n+kERUFG8BrA0BwjeAv2M8WLQBtcy+SD6fNsmnB3AlBLrgTtVW1c2QN4bVWLATaIS60J2Du5y1TiJgjSBvFVZgTmwCU+dAZFoPxGEEs8nyHC9Bwe2GvEJv2WXZb0vjdyFT4Cxk3e/kIqlOGoVLwwPevpYHT+00T+hWwXDf4AJAOUqWcDhbwAAAAASUVORK5CYII=)!important}#toast-container>.toast-error{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHOSURBVEhLrZa/SgNBEMZzh0WKCClSCKaIYOED+AAKeQQLG8HWztLCImBrYadgIdY+gIKNYkBFSwu7CAoqCgkkoGBI/E28PdbLZmeDLgzZzcx83/zZ2SSXC1j9fr+I1Hq93g2yxH4iwM1vkoBWAdxCmpzTxfkN2RcyZNaHFIkSo10+8kgxkXIURV5HGxTmFuc75B2RfQkpxHG8aAgaAFa0tAHqYFfQ7Iwe2yhODk8+J4C7yAoRTWI3w/4klGRgR4lO7Rpn9+gvMyWp+uxFh8+H+ARlgN1nJuJuQAYvNkEnwGFck18Er4q3egEc/oO+mhLdKgRyhdNFiacC0rlOCbhNVz4H9FnAYgDBvU3QIioZlJFLJtsoHYRDfiZoUyIxqCtRpVlANq0EU4dApjrtgezPFad5S19Wgjkc0hNVnuF4HjVA6C7QrSIbylB+oZe3aHgBsqlNqKYH48jXyJKMuAbiyVJ8KzaB3eRc0pg9VwQ4niFryI68qiOi3AbjwdsfnAtk0bCjTLJKr6mrD9g8iq/S/B81hguOMlQTnVyG40wAcjnmgsCNESDrjme7wfftP4P7SP4N3CJZdvzoNyGq2c/HWOXJGsvVg+RA/k2MC/wN6I2YA2Pt8GkAAAAASUVORK5CYII=)!important}#toast-container>.toast-success{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADsSURBVEhLY2AYBfQMgf///3P8+/evAIgvA/FsIF+BavYDDWMBGroaSMMBiE8VC7AZDrIFaMFnii3AZTjUgsUUWUDA8OdAH6iQbQEhw4HyGsPEcKBXBIC4ARhex4G4BsjmweU1soIFaGg/WtoFZRIZdEvIMhxkCCjXIVsATV6gFGACs4Rsw0EGgIIH3QJYJgHSARQZDrWAB+jawzgs+Q2UO49D7jnRSRGoEFRILcdmEMWGI0cm0JJ2QpYA1RDvcmzJEWhABhD/pqrL0S0CWuABKgnRki9lLseS7g2AlqwHWQSKH4oKLrILpRGhEQCw2LiRUIa4lwAAAABJRU5ErkJggg==)!important}#toast-container>.toast-warning{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGYSURBVEhL5ZSvTsNQFMbXZGICMYGYmJhAQIJAICYQPAACiSDB8AiICQQJT4CqQEwgJvYASAQCiZiYmJhAIBATCARJy+9rTsldd8sKu1M0+dLb057v6/lbq/2rK0mS/TRNj9cWNAKPYIJII7gIxCcQ51cvqID+GIEX8ASG4B1bK5gIZFeQfoJdEXOfgX4QAQg7kH2A65yQ87lyxb27sggkAzAuFhbbg1K2kgCkB1bVwyIR9m2L7PRPIhDUIXgGtyKw575yz3lTNs6X4JXnjV+LKM/m3MydnTbtOKIjtz6VhCBq4vSm3ncdrD2lk0VgUXSVKjVDJXJzijW1RQdsU7F77He8u68koNZTz8Oz5yGa6J3H3lZ0xYgXBK2QymlWWA+RWnYhskLBv2vmE+hBMCtbA7KX5drWyRT/2JsqZ2IvfB9Y4bWDNMFbJRFmC9E74SoS0CqulwjkC0+5bpcV1CZ8NMej4pjy0U+doDQsGyo1hzVJttIjhQ7GnBtRFN1UarUlH8F3xict+HY07rEzoUGPlWcjRFRr4/gChZgc3ZL2d8oAAAAASUVORK5CYII=)!important}#toast-container.toast-bottom-center>div,#toast-container.toast-top-center>div{width:300px;margin-left:auto;margin-right:auto}#toast-container.toast-bottom-full-width>div,#toast-container.toast-top-full-width>div{width:96%;margin-left:auto;margin-right:auto}.toast{background-color:#030303}.toast-success{background-color:#51a351}.toast-error{background-color:#bd362f}.toast-info{background-color:#2f96b4}.toast-warning{background-color:#f89406}.toast-progress{position:absolute;left:0;bottom:0;height:4px;background-color:#000;opacity:.4;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=40);filter:alpha(opacity=40)}@media (max-width:240px){#toast-container>div{padding:8px 8px 8px 50px;width:11em}#toast-container>div.rtl{padding:8px 50px 8px 8px}#toast-container .toast-close-button{right:-.2em;top:-.2em}#toast-container .rtl .toast-close-button{left:-.2em;right:.2em}}@media (min-width:241px) and (max-width:480px){#toast-container>div{padding:8px 8px 8px 50px;width:18em}#toast-container>div.rtl{padding:8px 50px 8px 8px}#toast-container .toast-close-button{right:-.2em;top:-.2em}#toast-container .rtl .toast-close-button{left:-.2em;right:.2em}}@media (min-width:481px) and (max-width:768px){#toast-container>div{padding:15px 15px 15px 50px;width:25em}#toast-container>div.rtl{padding:15px 50px 15px 15px}}", "" ]), 
    e.exports = t;
} ]);