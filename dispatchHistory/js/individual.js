//#region GLOBALS
const dispTableID = ["eList", "eListNon"];
//#endregion

//#region BINDS
$(document).ready(function () {
  Promise.all([getGroups(), getEmployees()])
    .then(([grps, emps]) => {
      fillGroups(grps);
      fillEmployees(emps);
    })
    .catch((error) => {
      alert(`${error}`);
    });
  mainHeight();
});
$(window).on("resize", function () {
  mainHeight();
});
$(document).on("click", "#menu", function () {
  $(".navigation").addClass("open");
  $("body").addClass("overflow-hidden");
});
$(document).on("click", "#closeNav", function () {
  $(".navigation").removeClass("open");
  $("body").removeClass("overflow-hidden");
});
$(document).on("click", ".table-titles .title.first", function () {
  $(".table-titles .title.second, .table-two").removeClass("active");
  $(this).addClass("active");
  $(".table-one").addClass("active");
});
$(document).on("click", ".table-titles .title.second", function () {
  $(".table-titles .title.second, .table-two").addClass("active");
  $(".table-titles .title.first, .table-one").removeClass("active");
});
$(document).on("click", ".seeMore", function () {
  var empID = $(this).attr("id");
  window.location.href = `../empDetails?id=${empID}`;
});
$(document).on("click", ".title", function () {
  getEmployees()
    .then((emps) => {
      fillEmployees(emps);
    })
    .catch((error) => {
      alert(`${error}`);
    });
});
$(document).on("change", "#grpSel", function () {
  getEmployees()
    .then((emps) => {
      fillEmployees(emps);
    })
    .catch((error) => {
      alert(`${error}`);
    });
});
$(document).on("input", "#empSearch", function () {
  getEmployees()
    .then((emps) => {
      fillEmployees(emps);
    })
    .catch((error) => {
      alert(`${error}`);
    });
});
//#endregion

//#region FUNCTIONS
function mainHeight() {
  var title = $(".pageTitle").css("height");

  $(".main").css("height", `calc(100vh - ${title}`);
  // console.log(title);
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
function getEmployees() {
  const grpID = $("#grpSel").find("option:selected").attr("grp-id");
  const disp = $(".title.first").hasClass("active") ? 1 : 0;
  const keyword = $("#empSearch").val();
  dispatch_days = 0;
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "php/get_employee_list.php",
      data: {
        groupID: grpID,
        dispatch: disp,
        searchkey: keyword,
      },
      dataType: "json",
      success: function (response) {
        const emps = response;
        resolve(emps);
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
function fillEmployees(emps) {
  var tableFD = $("#eList");
  var tableND = $("#eListNon");
  tableFD.empty();
  tableND.empty();
  $.each(emps, function (index, item) {
    var row = $(`<tr d-id=${item.empID}>`);
    row.append(`<td>${item.empID}</td>`);
    row.append(`<td>${item.firstname} ${item.lastname}</td>`);
    row.append(`<td>${item.groupAbbr}</td>`);
    row.append(`<td>${item.passportExpiry}</td>`);
    row.append(`<td>${item.visaExpiry}</td>`);
    row.append(
      `<td><i class="bx bxs-user-detail fs-5 seeMore" id=${item.empID}></i></td>`
    );

    if (item.dispatch == 1) {
      tableFD.append(row);
    } else {
      tableND.append(row);
    }
  });
  dispTableID.forEach((element) => {
    checkEmpty(element);
  });
}
function checkEmpty(tbodyID) {
  var tbodySelector = "#" + tbodyID;
  if ($(tbodySelector + " tr").length === 0) {
    var newRow = `<tr><td colspan="6" class="text-center">No data found</td></tr>`;
    $(tbodySelector).append(newRow);
  }
}
//#endregion
