//#region GLOBALS
switch (document.location.hostname) {
  case "kdt-ph":
    rootFolder = "//kdt-ph/";
    break;
  case "localhost":
    rootFolder = "//localhost/";
    break;
  default:
    rootFolder = "//kdt-ph/";
    break;
}
const dispTableID = ["eList", "eListNon"];
//#endregion
checkAccess()
  .then((acc) => {
    if (acc) {
      $(document).ready(function () {
        Promise.all([getGroups(), getYear()])
          .then(([grps, yr]) => {
            fillGroups(grps);
            fillYear(yr);
            getReport()
              .then((rep) => {
                createTable(rep);
              })
              .catch((error) => {
                alert(`${error}`);
              });
          })
          .catch((error) => {
            alert(`${error}`);
          });
      });
    } else {
      alert("Access denied");
      window.location.href = `${rootFolder}`;
    }
  })
  .catch((error) => {
    alert(`${error}`);
  });
//#region BINDS

$(document).on("click", "#menu", function () {
  $(".navigation").addClass("open");
  $("body").addClass("overflow-hidden");
});
$(document).on("click", "#closeNav", function () {
  $(".navigation").removeClass("open");
  $("body").removeClass("overflow-hidden");
});

$(document).on("change", "#grpSel", function () {
  getReport()
    .then((rep) => {
      createTable(rep);
    })
    .catch((error) => {
      alert(`${error}`);
    });
});
$(document).on("change", "#yearSel", function () {
  $("#selectedYear").text($(this).val());
  getReport()
    .then((rep) => {
      createTable(rep);
    })
    .catch((error) => {
      alert(`${error}`);
    });
});
$(document).on("click", "#btnExport", function () {
  exportTable();
});
//#endregion

//#region FUNCTIONS
function createTable(repData) {
  $("#dataHere").empty();
  Object.entries(repData).forEach(([key, groups]) => {
    $("#dataHere").append(
      `<tr><td colspan=8 class='text-start' data-f-name="Arial" data-f-sz="9"  data-a-h="left" data-a-v="middle" 	data-b-a-s="thin" data-b-a-c="000000">${key}</td></tr>`
    );
    groups.forEach((element) => {
      var ele = $(element.dispatch);
      var rspan = ele.length;
      var visa = element.visaExpiry;
      var str = "";
      var deets = `
  <td rowspan="${rspan}" data-f-name="Arial" data-f-sz="9"  data-a-h="center" data-a-v="middle" 	data-b-a-s="thin" data-b-a-c="000000">${
        element.empName
      }</td>
  <td rowspan="${rspan}" data-f-name="Arial" data-f-sz="9"  data-a-h="center" data-a-v="middle" 	data-b-a-s="thin" data-b-a-c="000000">${
        element.groupName
      }</td>
  <td rowspan="${rspan}" data-f-name="Arial" data-f-sz="9"  data-a-h="center" data-a-v="middle" 	data-b-a-s="thin" data-b-a-c="000000">${
        visa || "-"
      }</td>
  `;
      var tot = `
  <td rowspan="${rspan}" data-f-name="Arial" data-f-sz="9"  data-a-h="center" data-a-v="middle" 	data-b-a-s="thin" data-b-a-c="000000">${element.totalDays}</td>
  `;

      if (rspan === 0) {
        str += `
  <tr>
    <td data-f-name="Arial" data-f-sz="9"  data-a-h="center" data-a-v="middle" 	data-b-a-s="thin" data-b-a-c="000000" rowspan="1">${
      element.empName
    }</td>
    <td data-f-name="Arial" data-f-sz="9"  data-a-h="center" data-a-v="middle" 	data-b-a-s="thin" data-b-a-c="000000" rowspan="1">${
      element.groupName
    }</td>
    <td data-f-name="Arial" data-f-sz="9"  data-a-h="center" data-a-v="middle" 	data-b-a-s="thin" data-b-a-c="000000" rowspan="1">${
      element.visaExpiry || "-"
    }</td>
    <td data-f-name="Arial" data-f-sz="9"  data-a-h="center" data-a-v="middle" 	data-b-a-s="thin" data-b-a-c="000000">-</td>
    <td data-f-name="Arial" data-f-sz="9"  data-a-h="center" data-a-v="middle" 	data-b-a-s="thin" data-b-a-c="000000">-</td>
    <td data-f-name="Arial" data-f-sz="9"  data-a-h="center" data-a-v="middle" 	data-b-a-s="thin" data-b-a-c="000000">-</td>
    <td data-f-name="Arial" data-f-sz="9"  data-a-h="center" data-a-v="middle" 	data-b-a-s="thin" data-b-a-c="000000">-</td>
    <td data-f-name="Arial" data-f-sz="9"  data-a-h="center" data-a-v="middle" 	data-b-a-s="thin" data-b-a-c="000000" rowspan="1">-</td>
    
  </tr> 
  `;
      } else {
        element.dispatch.forEach((dispData, index) => {
          var dDeets = "";
          var dTot = "";
          if (index === 0) {
            dDeets = deets;
            dTot = tot;
          }
          str += `<tr>
      ${dDeets}
      <td data-f-name="Arial" data-f-sz="9"  data-a-h="center" data-a-v="middle" 	data-b-a-s="thin" data-b-a-c="000000">${dispData.totalPast}</td>
      <td data-f-name="Arial" data-f-sz="9"  data-a-h="center" data-a-v="middle" 	data-b-a-s="thin" data-b-a-c="000000">${dispData.dispatch_from}</td>
      <td data-f-name="Arial" data-f-sz="9"  data-a-h="center" data-a-v="middle" 	data-b-a-s="thin" data-b-a-c="000000">${dispData.dispatch_to}</td>
      <td data-f-name="Arial" data-f-sz="9"  data-a-h="center" data-a-v="middle" 	data-b-a-s="thin" data-b-a-c="000000">${dispData.duration}</td>
      ${dTot}
      
      </tr>`;
        });
      }

      $("#dataHere").append(str);
    });
  });
}
function getReport() {
  const grpID = $("#grpSel").find("option:selected").attr("grp-id");
  const yr = $("#yearSel").val();
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "php/get_report.php",
      data: {
        groupID: grpID,
        yearSelected: yr,
      },
      dataType: "json",
      success: function (response) {
        const rep = response;
        resolve(rep);
      },
      error: function (xhr, status, error) {
        if (xhr.status === 404) {
          reject("Not Found Error: The requested resource was not found.");
        } else if (xhr.status === 500) {
          reject("Internal Server Error: There was a server error.");
        } else {
          reject("An unspecified error occurred.");
        }
      },
    });
  });
}

function getGroups() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: "php/get_groups.php",
      dataType: "json",
      success: function (response) {
        const grps = response;
        resolve(grps);
      },
      error: function (xhr, status, error) {
        if (xhr.status === 404) {
          reject("Not Found Error: The requested resource was not found.");
        } else if (xhr.status === 500) {
          reject("Internal Server Error: There was a server error.");
        } else {
          reject("An unspecified error occurred.");
        }
      },
    });
  });
}
function fillGroups(grps) {
  var grpSelect = $("#grpSel");
  grpSelect.html("<option>Select Group</option>");
  $.each(grps, function (index, item) {
    var option = $("<option>")
      .attr("value", item.id)
      .text(item.abbreviation)
      .attr("grp-id", item.id);
    grpSelect.append(option);
  });
}
function checkAccess() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: "php/check_permission.php",
      dataType: "json",
      success: function (data) {
        const acc = data;
        resolve(acc);
      },
      error: function (xhr, status, error) {
        if (xhr.status === 404) {
          reject("Not Found Error: The requested resource was not found.");
        } else if (xhr.status === 500) {
          reject("Internal Server Error: There was a server error.");
        } else {
          reject("An unspecified error occurred.");
        }
      },
    });
  });
}
function getYear() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: "php/get_year.php",
      dataType: "json",
      success: function (response) {
        const yrs = response;
        resolve(yrs);
      },
      error: function (xhr, status, error) {
        if (xhr.status === 404) {
          reject("Not Found Error: The requested resource was not found.");
        } else if (xhr.status === 500) {
          reject("Internal Server Error: There was a server error.");
        } else {
          reject("An unspecified error occurred.");
        }
      },
    });
  });
}
function fillYear(yr) {
  $("#yearSel").empty();
  yr.forEach((element) => {
    $("#yearSel").append(`<option>${element}</option>`);
  });
  const curYear = new Date().getFullYear();
  $("#yearSel").val(curYear);
  $("#selectedYear").text(curYear);
}
function exportTable() {
  const yr = $("#yearSel").val();
  TableToExcel.convert(document.getElementById("repTable"), {
    name: `Dispatch_Report_${yr}.xlsx`,
    sheet: {
      name: `${yr}`,
    },
  });
}
//#endregion
