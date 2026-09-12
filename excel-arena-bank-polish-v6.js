(()=>{
  "use strict";
  const B=window.AVPArenaBank;
  if(!B?.concepts?.length||!B?.questions?.length)return;

  const norm=s=>String(s||"").trim().toUpperCase().replace(/\s+/g," ");
  const groups={
    shortcuts:[
      ["clipboard",["CTRL+C","CTRL+V"]],
      ["navigation",["CTRL+ARROW","CTRL+SHIFT+ARROW"]],
      ["quick-entry",["ALT+=","ALT+ENTER"]]
    ],
    "basic-functions":[
      ["basic-aggregate",["SUM","AVERAGE"]],
      ["extrema",["MAX","MIN"]],
      ["count",["COUNT","COUNTA"]],
      ["filtered-aggregate",["SUBTOTAL","AGGREGATE"]]
    ],
    conditional:[
      ["branch",["IF","IFS"]],
      ["boolean",["AND","OR"]],
      ["conditional-aggregate",["SUMIFS","COUNTIFS","AVERAGEIFS","MAXIFS","MINIFS"]]
    ],
    lookup:[
      ["lookup-basic",["XLOOKUP","VLOOKUP","LOOKUP"]],
      ["lookup-position",["INDEX","MATCH","XMATCH","INDEX+MATCH"]],
      ["lookup-reference",["INDIRECT","OFFSET"]]
    ],
    text:[
      ["substring",["LEFT","RIGHT","MID"]],
      ["text-clean",["TRIM","CLEAN"]],
      ["text-transform",["TEXTJOIN","SUBSTITUTE"]],
      ["text-convert",["TEXT","VALUE"]]
    ],
    "date-time":[
      ["current-time",["TODAY","NOW"]],
      ["month-shift",["EOMONTH","EDATE"]],
      ["workday",["NETWORKDAYS","WORKDAY"]],
      ["calendar-index",["WEEKDAY","WEEKNUM"]]
    ],
    "dynamic-array":[
      ["sort",["SORT","SORTBY"]],
      ["stack",["VSTACK","HSTACK"]],
      ["advanced-formula",["LET","LAMBDA"]]
    ],
    cleaning:[
      ["dedupe",["REMOVE DUPLICATES","DEDUP KEY"]],
      ["split-pattern",["TEXT TO COLUMNS","FLASH FILL"]],
      ["inspect-errors",["GO TO SPECIAL","ERROR CHECKING"]],
      ["normalize",["TYPE CONVERSION","STANDARDIZE CASE"]]
    ],
    "excel-table":[
      ["table-structure",["EXCEL TABLE","RESIZE TABLE","TABLE EXPANSION"]],
      ["table-formula",["STRUCTURED REFERENCE","TABLE NAME","CALCULATED COLUMN"]],
      ["table-display",["TOTAL ROW","BAND ROWS"]]
    ],
    pivot:[
      ["pivot-layout",["ROWS","COLUMNS","VALUES"]],
      ["pivot-core",["PIVOTTABLE","REFRESH","GROUP"]],
      ["pivot-analysis",["SHOW VALUES AS","GETPIVOTDATA","DISTINCT COUNT"]]
    ],
    dashboard:[
      ["chart-core",["COLUMN CHART","LINE CHART","COMBO CHART","SECONDARY AXIS"]],
      ["chart-special",["PARETO","SPARKLINE"]]
    ],
    "power-query":[
      ["pq-io",["GET DATA","CLOSE & LOAD","COMBINE FILES"]],
      ["pq-combine",["MERGE QUERIES","APPEND QUERIES"]],
      ["pq-reshape",["UNPIVOT","PIVOT COLUMN"]],
      ["pq-join",["LEFT OUTER","INNER JOIN","LEFT ANTI"]],
      ["pq-clean",["CHANGE TYPE","FILTER ROWS","REMOVE DUPLICATES","SPLIT COLUMN","FILL DOWN","PROMOTE HEADERS"]],
      ["pq-performance",["QUERY FOLDING","TABLE.SELECTCOLUMNS","TABLE.BUFFER"]]
    ],
    vba:[
      ["vba-procedure",["SUB","FUNCTION"]],
      ["vba-cell",["RANGE","CELLS"]],
      ["vba-container",["WORKSHEET","WORKBOOK"]],
      ["vba-loop",["FOR EACH","DO WHILE"]],
      ["vba-robustness",["OPTION EXPLICIT","ON ERROR","DEBUG.PRINT"]],
      ["vba-performance",["SCREENUPDATING","CALCULATION"]]
    ],
    workflow:[
      ["data-control",["RECONCILIATION","UNIQUE KEY","DOUBLE COUNT","CONTROL TOTAL","SOURCE OF TRUTH","SCHEMA CHECK"]],
      ["delivery-test",["REFRESH TEST","EDGE CASE","HANDOVER"]]
    ]
  };

  const difficultyOverrides=new Map([
    ["conditional|AND",1],["conditional|OR",1],
    ["lookup|VLOOKUP",1],["lookup|MATCH",1],
    ["date-time|DATE",1],["date-time|WEEKDAY",1],
    ["dynamic-array|SORT",1],
    ["cleaning|FLASH FILL",1],
    ["excel-table|TOTAL ROW",1],["excel-table|STRUCTURED REFERENCE",1]
  ]);

  const familyFor=c=>{
    const answer=norm(c.answer);
    const topicGroups=groups[c.topic]||[];
    for(const [name,answers] of topicGroups){
      if(answers.includes(answer))return `${c.topic}:${name}`;
    }
    return `answer:${answer}`;
  };

  const conceptMap=new Map();
  B.concepts.forEach(c=>{
    const key=`${c.topic}|${norm(c.answer)}`;
    const base=Math.max(1,Math.min(5,Number(c.difficulty)||1));
    c.difficulty=difficultyOverrides.get(key)||base;
    c.family=familyFor(c);
    conceptMap.set(c.id,c);
  });

  const activeVariants=new Set([1,5,20]);
  const compact=s=>String(s||"").replace(/\s+/g," ").replace(/\s+([,.!?;:])/g,"$1").trim();
  const sentence=s=>{
    s=compact(s);
    if(!s)return "Chọn đáp án phù hợp nhất.";
    return /[.!?]$/.test(s)?s:`${s}.`;
  };

  B.questions.forEach(q=>{
    const c=conceptMap.get(q.conceptId);
    if(!c)return;
    const m=String(q.id||"").match(/-v(\d+)$/);
    const variant=m?Number(m[1]):1;
    q.__arenaEnabled=activeVariants.has(variant);
    q.difficulty=c.difficulty;
    q.family=c.family;
    q.scenario=c.scenario;
    if(!q.__arenaEnabled)return;

    if(variant===20){
      q.prompt=`${sentence(c.scenario)} Chọn đáp án phù hợp nhất.`;
      q.boss=true;
    }else if(variant===5){
      q.prompt=sentence(c.scenario);
      q.boss=false;
    }else{
      q.prompt=`Công cụ hoặc hàm nào dùng để ${compact(c.meaning)}?`;
      q.boss=false;
    }
  });
})();
