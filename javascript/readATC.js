async function readATCLOne() {
  let response = await axios.get("../localData/ATCCodeLOne.json");
  console.log(response.data);
  return response.data;
}

async function readATCLTwo() {
  let response = await axios.get("../localData/ATCCodeLTwo.csv");
  //   console.log(response.data.split("\r\n"));
  return response.data.split("\r\n");
  // return response.data.result.records;
}

async function readATCLOne() {
  let response = await axios.get("../localData/ATCCodeLOne.json");
  return response.data;
}

function transformATCLTwo(rawData) {
  let atcObj = {};
  for (let el of rawData) {
    let key = el.slice(0, 3).toLowerCase();
    let value = el.slice(4);
    atcObj[key] = value;
  }
  //   console.log(atcObj);
  return atcObj;
}

async function mergeATCData() {
  let data1 = await readATCLOne();
  let data2 = await readATCLTwo();
  data2 = transformATCLTwo(data2);
  let obj = {
    ...data1,
    ...data2,
  };
  return obj;
}
