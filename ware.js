import result from cold.js;
const bodyparser = require('body-parser');
const express = require('express');
console.log(result);
const app = express();
app.use(bodyparser.urlencoded({ extended: true })); 


var urlencodedParser = bodyparser.urlencoded({ extended: false })
app.use(urlencodedParser);
const fs = require("fs");
var pg = require('pg');

var conString = "postgres://postgres:asb@localhost:5432/postgres";

var client = new pg.Client(conString);
client.connect(function (err) {
  if (err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT NOW() AS "theTime"', function (err, result) {
    if (err) {
      return console.error('error running query', err);
    }
    console.log("connected to the database", result.myvalue[0].theTime);    
  });
});

buildtable(myarray);
    function buildtable(data){
      var table=document.getElementById('mytable')
      for(var i=0;i<data.length;i++){
        var row=`<tr class="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0">
        <td class="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
          <span class="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">seg_no</span>
          ${data[i].segno}
        </td>
        <td class="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
          <span class="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">temp_range</span>
            ${data[i].temp}
        </td>
        <td class="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
          <span class="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">area</span>
          ${data[i].area}
        </td>
        <td class="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
          <span class="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">no_of_chamber</span>
            ${data[i].chamber}
        </td>
<td class="p-3 px-5 flex justified-center"><button type="button" class="mr-3 text-sm bg-green-600 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Edit</button><button type="button" class="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Delete</button></td>
                   
      </tr>`
                table.innerHTML+=row
              }

    }