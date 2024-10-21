// ==UserScript==
// @name         UCAS Realtime GPA
// @namespace    https://github.com/SilWhite
// @version      0.1(2024-10-21)
// @description  a script to get realtime GPA from UCAS course website SEP
// @author       SilWhite
// @match        https://xkcts.ucas.ac.cn:8443/score/bks/*
// @exclude      https://xkcts.ucas.ac.cn:8443/score/bks/visiting
// @exclude      https://xkcts.ucas.ac.cn:8443/score/bks/rebuild
// @grant        none
// ==/UserScript==

// 成绩映射
// 缺少补考及格
// 缺少pf处理逻辑
const score_gpa = new Map([[90, 4.0], [87, 3.9], [85, 3.8], [83, 3.7], [82, 3.6], [80, 3.5], [78, 3.4], [76, 3.3], [75, 3.2], [74, 3.1], [73, 3.0], [72, 2.9], [71, 2.8], [69, 2.7], [68, 2.6], [67, 2.5], [66, 2.4], [64, 2.3], [63, 2.2], [62, 2.1], [61, 1.8], [60, 1.6]]);

const grade_gpa = new Map([['A', 4.0], ['A-', 3.8], ['B+', 3.6], ['B', 3.4], ['B-', 3.2], ['C+', 2.8], ['C', 2.4], ['C-', 2.1], ['D', 1.6], ['D-', 1.0], ['F', 0.0]]);

const five_gpa = new Map([['优秀', 4.0], ['良好', 3.4], ['中等', 2.4], ['及格', 1.6], ['不及格', 0.0]]);

const pf_gpa = new Map([['合格', 4.0], ['不合格', 0.0]]);

(main)()

function main() {
    let data = getOriginalData();
    let gpa = calculateGPA(data.creditlist, data.scorelist, data.modelist);
    let weight_score = calculateWeightScore(data.creditlist, data.scorelist, data.pflist);
    dispayGPA(gpa, weight_score);
}

function getOriginalData() {
    const rows = document.querySelectorAll(".table-striped.table-bordered.table-advance.table-hover tbody tr");
    let creditlist = [], scorelist = [], modelist = [], pflist = [];
    let grades = Array.from(grade_gpa.keys());
    let fivepoint = Array.from(five_gpa.keys());

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll("td");
        let credit, score;
        if (cells) {
            credit = cells[3].textContent.trim();
            score = cells[4].textContent.trim();
            if (score != "") {
                if (!isNaN(parseFloat(score))) {
                    creditlist.push(parseFloat(credit));
                    scorelist.push(parseFloat(score));
                    modelist.push("score");
                } else if (score.includes(grades)) {
                    creditlist.push(parseFloat(credit));
                    scorelist.push(score);
                    modelist.push("grade");
                } else if (score.includes(fivepoint)) {
                    creditlist.push(parseFloat(credit));
                    scorelist.push(score);
                    modelist.push("five");
                    // 在助教培训上说：合格/不合格（pf），.../及格/不及格（五级制）【2024.9.24】
                } else if (score == 'W') {
                    continue; // 中期退课
                } else {// PF成绩
                    // // ？？？？？为什么读取合格会报错，不理解？？？？？？
                    // if (score == "合格") {
                    //     pflist.push(0);
                    // } else if (score == "不合格") {
                    //     pflist.push(1);
                    // } else {
                    console.log("Invalid score: " + score + ", in " + cells[1].textContent.trim());
                    // throw "Invalid score: " + score;
                }
            }
        }
    }
    return { creditlist, scorelist, modelist, pflist }
}


function dispayGPA(gpa, weight_score) {
    var tgtTableElement = document.querySelector('table[align="center"][border="0"][cellpadding="2"][cellspacing="2"]');
    var newTr1 = document.createElement('tr');
    var newTd1 = document.createElement('td');
    var newTd2 = document.createElement('td');
    var newTr2 = document.createElement('tr');
    var newTd3 = document.createElement('td');
    newTd1.textContent = "当前页面GPA: " + gpa.toFixed(2);
    newTd2.textContent = "当前页面加权成绩（综评）: " + weight_score.toFixed(2);
    newTd3.textContent = "总GPA: （暂未提供）";//后续添加
    newTr1.appendChild(newTd1);
    newTr1.appendChild(newTd2);
    newTr2.appendChild(newTd3);
    tgtTableElement.appendChild(newTr1);
    tgtTableElement.appendChild(newTr2);
}

function calculateWeightScore(creditlist, scorelist, pflist) { //pf不合格减分（综评要求每门不合格扣2%）
    rst = 0.0;
    totalcredit = 0.0;
    totalscore = 0.0;
    for (let i = 0; i < creditlist.length; i++) {
        totalcredit += creditlist[i];
        totalscore += scorelist[i] * creditlist[i];
    }
    rst = totalscore / totalcredit;

    fail_num = 0;
    for (let i = 0; i < pflist.length; i++) {
        fail_num += pflist[i]; // 合格为0，不合格为1
    }
    if (fail_num > 0) {
        rst *= (1 - 0.02 * fail_num);
    }
    return rst;
}

function calculateGPA(creditlist, scorelist, modelist) {
    let gpalist = [];
    for (let i = 0; i < creditlist.length; i++) {
        score = scorelist[i];
        mode = modelist[i];
        gpa = getGPA(score, mode);
        gpalist.push(gpa);
    }
    let totalcredit = 0.0;
    let totalgpa = 0.0;
    for (let i = 0; i < gpalist.length; i++) {
        totalcredit += creditlist[i];
        totalgpa += gpalist[i] * creditlist[i];
    }
    return totalgpa / totalcredit;
}


function getGPA(score, mode) {
    // mode == 'score', 'grade' and 'five'
    var gpa = 0.0;
    if (mode == "score") {
        gpa = socre2gpa(score);
    } else if (mode == "grade") {
        gpa = grade2gpa(score);
    } else if (mode == "five") {
        gpa = five2gpa(score);
    } else {
        throw "Invalid mode!";
    }
    return gpa;
}



function socre2gpa(score) {
    for (let [i, j] of score_gpa) {
        if (score >= i) {
            return j;
        }
    }
    throw "Invalid score!";// 成绩不包含在列表
}


function grade2gpa(grade) {
    for (let [i, j] of grade_gpa) {
        if (grade == i) {
            return j;
        }
    }
    throw "Invalid grade!";// 成绩不包含在列表
}


function five2gpa(five) {
    for (let [i, j] of five_gpa) {
        if (five == i) {
            return j;
        }
    }
    throw "Invalid five-point scale!";// 成绩不包含在列表
}

