(()=>{
  "use strict";
  const B=window.AVPArenaBank;
  if(!B?.concepts?.length||!B?.questions?.length)return;

  const norm=s=>String(s||"").trim().toUpperCase().replace(/\s+/g," ");
  const groups={
    shortcuts:[
      ["clipboard",["CTRL+C","CTRL+V"]],
      ["undo-format",["CTRL+Z","CTRL+1"]],
      ["navigation",["CTRL+ARROW","CTRL+SHIFT+ARROW"]],
      ["quick-entry",["ALT+=","ALT+ENTER"]]
    ],
    "basic-functions":[
      ["aggregate",["SUM","AVERAGE"]],
      ["extrema",["MAX","MIN"]],
      ["count",["COUNT","COUNTA"]],
      ["filtered-aggregate",["SUBTOTAL","AGGREGATE"]]
    ],
    conditional:[
      ["branch",["IF","IFS"]],
      ["boolean",["AND","OR"]],
      ["error",["IFERROR"]],
      ["conditional-aggregate",["SUMIFS","COUNTIFS","AVERAGEIFS","MAXIFS","MINIFS"]]
    ],
    lookup:[
      ["lookup-basic",["XLOOKUP","VLOOKUP","LOOKUP"]],
      ["lookup-position",["INDEX","MATCH","XMATCH","INDEX+MATCH"]],
      ["lookup-reference",["INDIRECT","OFFSET"]],
      ["lookup-filter",["FILTER"]]
    ],
    text:[
      ["substring",["LEFT","RIGHT","MID"]],
      ["length",["LEN"]],
      ["clean",["TRIM","CLEAN"]],
      ["join-replace",["TEXTJOIN","SUBSTITUTE"]],
      ["convert",["TEXT","VALUE"]]
    ],
    "date-time":[
      ["current",["TODAY","NOW"]],
      ["build",["DATE"]],
      ["month-shift",["EOMONTH","EDATE"]],
      ["difference",["DATEDIF"]],
      ["workday",["NETWORKDAYS","WORKDAY"]],
      ["calendar-index",["WEEKDAY","WEEKNUM"]]
    ],
    "dynamic-array":[
      ["filter-unique",["FILTER","UNIQUE"]],
      ["sort",["SORT","SORTBY"]],
      ["sequence-take",["SEQUENCE","TAKE"]],
      ["stack",["VSTACK","HSTACK"]],
      ["advanced",["LET","LAMBDA"]]
    ],
    cleaning:[
      ["dedupe",["REMOVE DUPLICATES","DEDUP KEY"]],
      ["split-pattern",["TEXT TO COLUMNS","FLASH FILL"]],
      ["guard",["DATA VALIDATION","CONDITIONAL FORMATTING"]],
      ["inspect",["GO TO SPECIAL","ERROR CHECKING"]],
      ["normalize",["TYPE CONVERSION","STANDARDIZE CASE"]]
    ],
    "excel-table":[
      ["structure",["EXCEL TABLE","RESIZE TABLE","TABLE EXPANSION","CONVERT TO RANGE"]],
      ["formula",["STRUCTURED REFERENCE","TABLE NAME","CALCULATED COLUMN"]],
      ["display",["TOTAL ROW","BAND ROWS","SLICER"]]
    ],
    pivot:[
      ["layout",["ROWS","COLUMNS","VALUES"]],
      ["core",["PIVOTTABLE","REFRESH","GROUP"]],
      ["filter",["SLICER"]],
      ["analysis",["SHOW VALUES AS","GETPIVOTDATA","DISTINCT COUNT"]]
    ],
    dashboard:[
      ["kpi",["KPI CARD","TARGET LINE"]],
      ["chart-core",["COLUMN CHART","LINE CHART","COMBO CHART","SECONDARY AXIS"]],
      ["chart-special",["PARETO","SPARKLINE"]],
      ["interaction",["SLICER","DYNAMIC TITLE"]]
    ],
    "power-query":[
      ["io",["GET DATA","CLOSE & LOAD","COMBINE FILES"]],
      ["clean",["CHANGE TYPE","FILTER ROWS","REMOVE DUPLICATES","SPLIT COLUMN","FILL DOWN","PROMOTE HEADERS"]],
      ["combine",["MERGE QUERIES","APPEND QUERIES"]],
      ["reshape",["UNPIVOT","PIVOT COLUMN"]],
      ["group",["GROUP BY"]],
      ["join",["LEFT OUTER","INNER JOIN","LEFT ANTI"]],
      ["performance",["QUERY FOLDING","TABLE.SELECTCOLUMNS","TABLE.BUFFER"]]
    ],
    vba:[
      ["procedure",["SUB","FUNCTION"]],
      ["cell",["RANGE","CELLS"]],
      ["container",["WORKSHEET","WORKBOOK"]],
      ["loop",["FOR EACH","DO WHILE"]],
      ["branch",["SELECT CASE"]],
      ["robustness",["OPTION EXPLICIT","ON ERROR","DEBUG.PRINT"]],
      ["performance",["SCREENUPDATING","CALCULATION"]]
    ],
    workflow:[
      ["tool-choice",["POWER QUERY","PIVOTTABLE","XLOOKUP","EXCEL TABLE","DATA VALIDATION"]],
      ["control",["RECONCILIATION","UNIQUE KEY","DOUBLE COUNT","CONTROL TOTAL","SOURCE OF TRUTH","SCHEMA CHECK"]],
      ["delivery",["REFRESH TEST","EDGE CASE","HANDOVER"]]
    ]
  };

  const beginner={
    shortcuts:new Set(["CTRL+C","CTRL+V","CTRL+Z","CTRL+SHIFT+L","F4","CTRL+1","ALT+=","ALT+ENTER"]),
    "basic-functions":new Set(["SUM","AVERAGE","MAX","MIN","COUNT","COUNTA","ROUND"]),
    conditional:new Set(["IF","AND","OR","IFERROR"]),
    lookup:new Set(["XLOOKUP","VLOOKUP","MATCH"]),
    text:new Set(["LEFT","RIGHT","MID","LEN","TRIM","VALUE"]),
    "date-time":new Set(["TODAY","NOW","DATE","WEEKDAY"]),
    "dynamic-array":new Set(["FILTER","UNIQUE","SORT","SEQUENCE"]),
    cleaning:new Set(["REMOVE DUPLICATES","TEXT TO COLUMNS","FLASH FILL","DATA VALIDATION","CONDITIONAL FORMATTING"]),
    "excel-table":new Set(["EXCEL TABLE","TOTAL ROW","STRUCTURED REFERENCE","TABLE NAME","CALCULATED COLUMN","BAND ROWS","TABLE EXPANSION"]),
    pivot:new Set(["PIVOTTABLE","ROWS","COLUMNS","VALUES","REFRESH","GROUP","SLICER"]),
    dashboard:new Set(["KPI CARD","COLUMN CHART","LINE CHART","SLICER","TARGET LINE"]),
    "power-query":new Set(["GET DATA","CHANGE TYPE","FILTER ROWS","REMOVE DUPLICATES","SPLIT COLUMN","FILL DOWN","PROMOTE HEADERS","CLOSE & LOAD"]),
    vba:new Set(["SUB","RANGE","CELLS","WORKSHEET","WORKBOOK"]),
    workflow:new Set(["POWER QUERY","PIVOTTABLE","XLOOKUP","EXCEL TABLE","DATA VALIDATION"])
  };

  const mixedMinLevel={
    shortcuts:1,"basic-functions":1,conditional:1,text:1,"date-time":1,cleaning:1,
    lookup:2,"excel-table":2,
    pivot:3,dashboard:3,"dynamic-array":3,"power-query":3,
    workflow:4,vba:4
  };

  const familyFor=c=>{
    const answer=norm(c.answer);
    for(const [name,answers] of (groups[c.topic]||[]))if(answers.includes(answer))return `${c.topic}:${name}`;
    return `answer:${answer}`;
  };

  const conceptMap=new Map();
  B.concepts.forEach(c=>{
    const answer=norm(c.answer);
    const base=Math.max(1,Math.min(5,Number(c.difficulty)||1));
    c.isBeginner=!!beginner[c.topic]?.has(answer);
    c.difficulty=c.isBeginner?1:Math.max(2,base);
    c.family=familyFor(c);
    c.mixedMinLevel=mixedMinLevel[c.topic]||1;
    conceptMap.set(c.id,c);
  });

  const compact=s=>String(s||"").replace(/\s+/g," ").replace(/\s+([,.!?;:])/g,"$1").trim();
  const sentence=s=>{s=compact(s);return !s?"Chọn đáp án phù hợp nhất.":(/[.!?]$/.test(s)?s:`${s}.`)};

  B.questions.forEach(q=>{
    const c=conceptMap.get(q.conceptId);
    if(!c)return;
    const m=String(q.id||"").match(/-v(\d+)$/);
    const variant=m?Number(m[1]):0;
    q.__arenaEnabled=variant===5;
    q.difficulty=c.difficulty;
    q.family=c.family;
    q.scenario=sentence(c.scenario);
    q.meaning=compact(c.meaning);
    q.learningNote=`${c.answer} — ${compact(c.meaning)}.`;
    q.prompt=q.scenario;
    q.boss=false;
  });
})();