var list = document.querySelectorAll("article > *");

var item = null,
  ques = [];
list.forEach((i) => {
  const tag = i.tagName.toLowerCase();
  if (tag === "hr" && item !== null) {
    delete item["hr"];
    ques.push(item);
    item = null;
  } else {
    item = item ?? {};
    if (tag === "ul") {
      item["opt"] = Array.from(i.childNodes)
        .map((i) => i.innerHTML)
        .filter((i) => i);
    } else if (tag === "details") {
      const t = Array.from(i.childNodes);
      // discard first two
      t.shift();
      t.shift();

      // t.shift();
      // item["ans"] = ans;
      item["details"] = t.map((i) => i.innerHTML).filter((i) => i);
      item["ans"] = item["details"][1].slice(-1);
      item["details"] = item["details"].slice(2);
    } else if (tag === "h6") {
      item["ques"] = i.innerText;
    } else if (tag === "div") {
      item["code"] = i.innerText;
    } else {
      item[tag] = i.innerText;
    }
  }
});
if (item) ques.push(item);

// Delete first two as they're not questions
ques.shift();
ques.shift();

// ques[0];
// Array.from(ques[0].ul.childNodes).map(i => i.innerHTML).filter(i => i !== '\n')
// Array.from(ques[0].ul.childNodes).map(i => i.innerHTML).filter(i => i)
