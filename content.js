(main)()

function main() {
    let data = getOriginalData();
    let gpa = calculateGPA(data.creditlist, data.scorelist, data.modelist);
    dispayGPA(gpa);
}



function getOriginalData() {
    const rows = document.querySelectorAll(".table-striped.table-bordered.table-advance.table-hover tbody tr");
    let creditlist = [], scorelist = [], modelist = [];
    const grades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'D-', 'F']
    const fivepoint = ['优秀', '良好', '中等', '合格', '不合格']

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
                    continue; // 如何处理pf和五级制？都显示合格。
                    // modelist.push("five");
                } else if (score == 'W') {
                    continue; // 中期退课
                } else {
                    // 不知道为什么读取“合格”非法，可能是编码问题？
                    // throw "Invalid score: " + score;
                    console.log("Invalid score: " + score + ", in " + cells[1].textContent.trim());
                }
            }
        }
    }
    return { creditlist, scorelist, modelist }
}

function dispayGPA(gpa) {
    var tgtTableElement = document.querySelector('table[align="center"][border="0"][cellpadding="2"][cellspacing="2"]');
    var newTr = document.createElement('tr');
    var newTd1 = document.createElement('td');
    var newTd2 = document.createElement('td');
    newTd1.textContent = "总GPA: ";//后续添加
    newTd2.textContent = "当前页面GPA: " + gpa.toFixed(2);
    newTr.appendChild(newTd1);
    newTr.appendChild(newTd2);
    tgtTableElement.appendChild(newTr);
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
    var gpa = 0.0;
    if (score >= 90) {
        gpa = 4.0;
    } else if (score >= 87) {
        gpa = 3.9;
    } else if (score >= 85) {
        gpa = 3.8;
    } else if (score >= 83) {
        gpa = 3.7;
    } else if (score >= 82) {
        gpa = 3.6;
    } else if (score >= 80) {
        gpa = 3.5;
    } else if (score >= 78) {
        gpa = 3.4;
    } else if (score >= 76) {
        gpa = 3.3;
    } else if (score >= 75) {
        gpa = 3.2;
    } else if (score >= 74) {
        gpa = 3.1;
    } else if (score >= 73) {
        gpa = 3.0;
    } else if (score >= 72) {
        gpa = 2.9;
    } else if (score >= 71) {
        gpa = 2.8;
    } else if (score >= 69) {
        gpa = 2.7;
    } else if (score >= 68) {
        gpa = 2.6;
    } else if (score >= 67) {
        gpa = 2.5;
    } else if (score >= 66) {
        gpa = 2.4;
    } else if (score >= 64) {
        gpa = 2.3;
    } else if (score >= 63) {
        gpa = 2.2;
    } else if (score >= 62) {
        gpa = 2.1;
    } else if (score >= 61) {
        gpa = 1.8;
    } else if (score >= 60) {
        gpa = 1.6;
    }
    //补考合格和不及格需要添加
    else {
        throw "Invalid score!";
    }
    return gpa;
}

function grade2gpa(grade) {
    var gpa = 0.0;
    if (grade == "A") {
        gpa = 4.0;
    } else if (grade == "A-") {
        gpa = 3.8;
    } else if (grade == "B+") {
        gpa = 3.6;
    } else if (grade == "B") {
        gpa = 3.4;
    } else if (grade == "B-") {
        gpa = 3.2;
    } else if (grade == "C+") {
        gpa = 2.8;
    } else if (grade == "C") {
        gpa = 2.4;
    } else if (grade == "C-") {
        gpa = 2.1;
    } else if (grade == "D") {
        gpa = 1.6;
    } else if (grade == "D-") {
        gpa = 1.0;
    } else if (grade == "F") {
        gpa = 0.0;
    } else {
        throw "Invalid grade!";
    }
    return gpa;
}

function five2gpa(five) {
    var gpa = 0.0;
    if (five == '优秀') {
        gpa = 4.0;
    } else if (five == '良好') {
        gpa = 3.4;
    } else if (five == '中等') {
        gpa = 2.4;
    } else if (five == '合格') {
        gpa = 1.6;
    } else if (five == '不合格') {
        gpa = 0.0;
    } else {
        throw "Invalid five-point scale!";
    }
    return gpa;
}

