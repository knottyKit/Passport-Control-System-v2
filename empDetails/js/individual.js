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
var empID = 0;
var userPassD = [];
var userPassI = [];
var userVisaI = [];
var userVisaD = [];
const full = 183;
var empDetails = [];
var dHistory = [];
var ename = "";
var editAccess;
// var dispatch_days = 0;
//#endregion

const url_string = window.location;
const url = new URL(url_string);
if (url.searchParams.get("id")) {
  empID = url.searchParams.get("id");
} else {
  window.location.href = "/PCS/";
}

checkAccess()
  .then((acc) => {
    if (acc) {
      $(document).ready(function () {
        Promise.all([
          getEmployeeDetails(),
          getPassport(true),
          getPassport(false),
          getVisa(true),
          getVisa(false),
          getDispatchHistory(),
          getDispatchDays(),
          getYearly(),
          getLocations(),
          checkEditAccess(),
        ])
          .then(
            ([
              emps,
              pportD,
              pportI,
              vsaD,
              vsaI,
              dlst,
              dd,
              yrl,
              locs,
              eAccess,
            ]) => {
              userPassD = pportD;
              userPassI = pportI;
              userVisaD = vsaD;
              userVisaI = vsaI;
              fillDetails(emps);
              passportDisplay(userPassD);
              passportInput(userPassI);
              visaDisplay(userVisaD);
              visaInput(userVisaI);
              dHistory = dlst;
              fillHistory(dHistory);
              displayDays(dd);
              fillYearly(yrl);
              fillLocations(locs);
              editAccess = eAccess;
              if (editAccess === false) {
                $(".editThis").removeAttr("data-bs-target");
                $(".editThis").removeAttr("data-bs-toggle");
              }
              // dispatch_days = dd;
            }
          )
          .catch((error) => {
            alert(`${error}`);
          });
        mainHeight();
        dispatchStatus();
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

$(window).on("resize", function () {
  mainHeight();
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
  window.location.href = "path/to/your/page.html";
});
$(document).on("click", "#menu", function () {
  $(".navigation").addClass("open");
  $("body").addClass("overflow-hidden");
});
$(document).on("click", "#closeNav", function () {
  $(".navigation").removeClass("open");
  $("body").removeClass("overflow-hidden");
});
$(document).on("mouseenter", ".editThis", function () {
  if (editAccess === true) {
    $(this).addClass("hov");
  }
});
$(document).on("mouseleave", ".editThis", function () {
  if (editAccess === true) {
    $(this).removeClass("hov");
  }
});
$(document).on("change", "#dispatchStatus", function () {
  dispatchStatus();
});
$(document).on("click", "#btn-updateVisa", function () {
  $("#updateVisa").find("input").removeAttr("disabled");
  $(this).closest(".modal").find(".attach").removeClass("d-none");
  $(this).closest(".modal-footer").html(`
  <button type="button" class="btn btn-secondary"  id="cancelEditVisa">
            Cancel
          </button>
          <button type="button" class="btn btn-success" id="btn-saveVisa">
            Save Changes
          </button>
  `);
});
$(document).on("click", "#btn-updatePass", function () {
  $("#updatePass").find("input").removeAttr("disabled");
  $(this).closest(".modal").find(".attach").removeClass("d-none");
  $(this).closest(".modal-footer").html(`
  <button type="button" class="btn btn-secondary" id="cancelEditPass">
            Cancel
          </button>
          <button type="button" class="btn btn-success" id="btn-savePass">
            Save Changes
          </button>
  `);
});
$(document).on("click", ".btn-close", function () {
  $(this).closest(".modal").find(".attach").addClass("d-none");
  $(this).closest(".modal").find("input").attr("disabled", true);
  $("#btn-saveEntry").attr("e-id", 0);
});
$(document).on("click", ".btn-cancel", function () {
  $(this).closest(".modal").find(".btn-close").click();
  $("#btn-saveEntry").attr("e-id", 0);
});
$(document).on("click", "#updatePass .btn-close", function () {
  resetPassInput();
});
$(document).on("click", "#updateVisa .btn-close", function () {
  resetVisaInput();
});
$(document).on("click", ".btn-delete", function () {
  var num = $(this).closest("tr").find("td:first-of-type").html();

  var trID = $(this).closest("tr").attr("d-id");
  $("#storeId").html(num);
  $("#storeId").attr("del-id", trID);
});
$(document).on("click", "#btn-deleteEntry", function () {
  deleteDispatch();
});
$(document).on("change", "#dToggle", function () {
  getDispatchHistory()
    .then((dlst) => {
      dHistory = dlst;
      fillHistory(dHistory);
    })
    .catch((error) => {
      alert(`${error}`);
    });
});
$(document).on("click", "#btn-saveDisStat", function () {
  saveStat();
});
$(document).on("click", "#btn-savePass", function () {
  savePass();
});
$(document).on("click", "#btn-saveVisa", function () {
  saveVisa();
});
$(document).on("click", "#cancelEditPass", function () {
  resetPassInput();
});
$(document).on("click", "#cancelEditVisa", function () {
  resetVisaInput();
});
// $(document).on("change", ".ddates.pass", function () {
//   var startD = $("#upPassIssue").val();
//   var endD = $("#upPassExp").val();

//   if (!startD || !endD) {
//     return;
//   }
//   var startDate = new Date(startD);
//   var endDate = new Date(endD);
//   if (endDate < startDate) {
//     alert("End date must not be earlier than start date.");
//     $("#upPassExp").val("");
//     return;
//   }
// });
// $(document).on("change", ".ddates.vsa", function () {
//   var startD = $("#upVisaIssue").val();
//   var endD = $("#upVisaExp").val();

//   if (!startD || !endD) {
//     return;
//   }
//   var startDate = new Date(startD);
//   var endDate = new Date(endD);
//   if (endDate < startDate) {
//     alert("End date must not be earlier than start date.");
//     $("#upVisaExp").val("");
//     return;
//   }
// });
$(document).on("click", "#upPassNo", function () {
  $(this).removeClass("border border-danger");
});
$(document).on("click", "#upPassBday", function () {
  $(this).removeClass("border border-danger");
});
$(document).on("click", "#upPassIssue", function () {
  $(this).removeClass("border border-danger");
});
$(document).on("click", "#upPassexp", function () {
  $(this).removeClass("border border-danger");
});
$(document).on("click", "#upPassBday", function () {
  $(this).removeClass("border border-danger");
});
$(document).on("click", "#upVisaNo", function () {
  $(this).removeClass("border border-danger");
});
$(document).on("click", "#upVisaIssue", function () {
  $(this).removeClass("border border-danger");
});
$(document).on("click", "#upVisaExp", function () {
  $(this).removeClass("border border-danger");
});
$(document).on("click", "#btn-saveEntry", function () {
  saveEditEntry();
});
$(document).on("change", ".edit-date", function () {
  computeTotalDays();
});
$(document).on("change", "#editentryDateJ", function () {
  $("#editentryDateP").attr("min", $(this).val());
});
$(document).on("change", "#editentryDateP", function () {
  $("#editentryDateJ").attr("max", $(this).val());
});
$(document).on("click", ".btn-edit", function () {
  // var loc = $(this).closest("tr").find("td:eq(1)").attr("value");
  // var japan = $(this).closest("tr").find("td:eq(2)").html();
  // var parsedDateJap = new Date(japan);

  // var formattedDateJap =
  //   parsedDateJap.getFullYear() +
  //   "-" +
  //   ("0" + (parsedDateJap.getMonth() + 1)).slice(-2) +
  //   "-" +
  //   ("0" + parsedDateJap.getDate()).slice(-2);
  // var ph = $(this).closest("tr").find("td:eq(3)").html();
  // var parsedDatePh = new Date(ph);
  // var formattedDatePh =
  //   parsedDatePh.getFullYear() +
  //   "-" +
  //   ("0" + (parsedDatePh.getMonth() + 1)).slice(-2) +
  //   "-" +
  //   ("0" + parsedDatePh.getDate()).slice(-2);

  // var total = $(this).closest("tr").find("td:eq(4)").html();
  // var totalpast = $(this).closest("tr").find("td:eq(5)").html();

  // $("#editentryDateJ").val(formattedDateJap);
  // $("#editentryDateP").val(formattedDatePh);
  // $("#editentryLocation").val(loc);
  // $(" #editentryDays").html(total);
  // $(" #editentryPYear").html(totalpast);
  var trID = parseInt($(this).closest("tr").attr("d-id"));
  getEditDetails(trID);
  $("#editentryDateP, #editentryDateJ").prop("disabled", false);
  $("#editEntry").modal("show");
  $("#btn-saveEntry").attr("e-id", trID);
});
$(document).on("click", "#btnExport", function () {
  exportTable();
});
//#endregion

//#region FUNCTIONS
function mainHeight() {
  var title = $(".pageTitle").css("height");

  if ($(window).width() > 1456) {
    $(".main").css("height", `calc(100vh - ${title}`);
  } else {
    $(".main").css("height", ``);
  }
}
// function resizeTable() {
//   var h1 = parseInt($(".top").css("height"));
//   var h2 = parseInt($(".mid").css("height"));

//   $(".bot").css("height", h1 + h2);
// }
function dispatchStatus() {
  var stat = $("#dispatchStatus").val();
  if (stat == 1) {
    $("#dispatchStatus").addClass("text-success").removeClass("text-danger");
  }
  if (stat == 0) {
    $("#dispatchStatus").addClass("text-danger").removeClass("text-success");
  }
}
function getEmployeeDetails() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "php/get_emp_details.php",
      data: {
        empID: empID,
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
          reject("An unspecified error occurred.1");
        }
      },
    });
  });
}
function fillDetails(empnum) {
  $("#empId").text(`${empnum.id}`);
  $(".surname").text(`${empnum.lastname},`);
  $(".givenname").text(`${empnum.firstname}`);
  $("#empPic").attr("src", empnum.pictureLink);
  if (empnum.dispatch == 0) {
    $("#dStat").addClass("bg-danger").removeClass("bg-success");
    $("#dStat").text("Non Dispatch");
  } else {
    $("#dStat").addClass("bg-success").removeClass("bg-danger");
    $("#dStat").text("For Dispatch");
  }
  $("#dispatchStatus").val(empnum.dispatch);
  dispatchStatus();
  $("#disModalEmpName").text(`${empnum.firstname} ${empnum.lastname}`);
  ename = `${empnum.firstname} ${empnum.lastname}`;
}
function getPassport(isDetails) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "php/get_passport.php",
      data: {
        empID: empID,
        isDetails: isDetails,
      },
      dataType: "json",
      success: function (response) {
        const pport = response;
        resolve(pport);
      },
      error: function (xhr, status, error) {
        if (xhr.status === 404) {
          reject("Not Found Error: The requested resource was not found.");
        } else if (xhr.status === 500) {
          reject("Internal Server Error: There was a server error.");
        } else {
          reject("An unspecified error occurred.2");
        }
      },
    });
  });
}

function passportDisplay(pport) {
  if (Object.keys(pport).length > 0) {
    const pnum = pport.number;
    const pbday = pport.bday;
    const pissue = pport.issue;
    const pexpiry = pport.expiry;
    const pvalid = pport.valid;
    $("#passNo").text(pnum);
    $("#passBday").text(pbday);
    $("#passIssue").text(pissue);
    $("#passExp").text(pexpiry);
    if (pvalid) {
      $("#passStatus").removeClass("bg-danger");
      $("#passStatus").addClass("bg-success");
      $("#passStatus").text("Valid");
    } else {
      $("#passStatus").removeClass("bg-success");
      $("#passStatus").addClass("bg-danger");
      $("#passStatus").text("Expired");
    }
    $("#passDeets").removeClass("d-none");
    $("#passEmpty").addClass("d-none");
  } else {
    $("#passDeets").addClass("d-none");
    $("#passEmpty").removeClass("d-none");
  }
}
function passportInput(pport) {
  const pnum = pport.number;
  const pbday = pport.bday;
  const pissue = pport.issue;
  const pexpiry = pport.expiry;
  const attach = pport.passportLink;
  $("#upPassNo").val(pnum);
  $("#upPassBday").val(pbday);
  $("#upPassIssue").val(pissue);
  $("#upPassExp").val(pexpiry);
  if (attach) {
    $("#wAttachPass").removeClass("d-none");
    $("#noAttachPass").addClass("d-none");
    $("#pAttach").html(
      `Click <a href="${attach}" target="_blank" style="color:var(--tertiary) !important;" class="fw-semibold">here</a> to view`
    );
    $("#passAttachView").attr("src", attach);
  } else {
    $("#noAttachPass").removeClass("d-none");
    $("#wAttachPass").addClass("d-none");
    $("#pAttach").html(`Attachment`);
  }
}
function getVisa(isDetails) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "php/get_visa.php",
      data: {
        empID: empID,
        isDetails: isDetails,
      },
      dataType: "json",
      success: function (response) {
        const vsa = response;
        resolve(vsa);
      },
      error: function (xhr, status, error) {
        if (xhr.status === 404) {
          reject("Not Found Error: The requested resource was not found.");
        } else if (xhr.status === 500) {
          reject("Internal Server Error: There was a server error.");
        } else {
          reject("An unspecified error occurred.3");
        }
      },
    });
  });
}
function fillVisa(vsa) {
  visaDisplay(vsa);
  visaInput(vsa);
}
function visaDisplay(vsa) {
  if (Object.keys(vsa).length > 0) {
    const vnum = vsa.number;
    const vissue = vsa.issue;
    const vexpiry = vsa.expiry;
    const vvalid = vsa.valid;
    $("#visaNo").text(vnum);
    $("#visaIssue").text(vissue);
    $("#visaExp").text(vexpiry);
    if (vvalid) {
      $("#visaStatus").removeClass("bg-danger");
      $("#visaStatus").addClass("bg-success");
      $("#visaStatus").text("Valid");
    } else {
      $("#visaStatus").removeClass("bg-success");
      $("#visaStatus").addClass("bg-danger");
      $("#visaStatus").text("Expired");
    }
    $("#visaDeets").removeClass("d-none");
    $("#visaEmpty").addClass("d-none");
  } else {
    $("#visaDeets").addClass("d-none");
    $("#visaEmpty").removeClass("d-none");
  }
}
function visaInput(vsa) {
  const vnum = vsa.number;
  const vissue = vsa.issue;
  const vexpiry = vsa.expiry;
  const attach = vsa.visaLink;
  $("#upVisaNo").val(vnum);
  $("#upVisaIssue").val(vissue);
  $("#upVisaExp").val(vexpiry);
  if (attach) {
    $("#wAttachVisa").removeClass("d-none");
    $("#noAttachVisa").addClass("d-none");
    $("#vAttach").html(
      `Click <a href="${attach}" target="_blank" style="color:var(--tertiary) !important;" class="fw-semibold">here</a> to view`
    );
    $("#visaAttachView").attr("src", attach);
  } else {
    $("#noAttachVisa").removeClass("d-none");
    $("#wAttachVisa").addClass("d-none");
    $("#vAttach").html(`Attachment`);
  }
}
function getDispatchHistory() {
  const yScope = parseInt($("#dToggle").val());

  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "php/get_dispatch_history.php",
      data: {
        empID: empID,
        yScope: yScope,
      },
      dataType: "json",
      success: function (response) {
        const dList = response;
        resolve(dList);
      },
      error: function (xhr, status, error) {
        if (xhr.status === 404) {
          reject("Not Found Error: The requested resource was not found.");
        } else if (xhr.status === 500) {
          reject("Internal Server Error: There was a server error.");
        } else {
          reject("An unspecified error occurred.haha");
        }
      },
    });
  });
}
function fillHistory(dlist) {
  var tableBody = $("#dList");
  tableBody.empty();
  if (dlist.length === 0) {
    var noDataRow = $(
      `<tr><td colspan='7' class="text-center">No data found</td></tr>`
    );
    tableBody.append(noDataRow);
  } else {
    $.each(dlist, function (index, item) {
      var row = $(`<tr d-id=${item.id}>`);
      row.append(`<td data-exclude="true">${index + 1}</td>`);
      row.append(
        `<td data-f-name="Arial" data-f-sz="9"  data-a-h="center" data-a-v="middle" 	data-b-a-s="thin" data-b-a-c="000000">${item.locationName}</td>`
      );
      row.append(
        `<td data-f-name="Arial" data-f-sz="9"  data-a-h="center" data-a-v="middle" 	data-b-a-s="thin" data-b-a-c="000000">${item.fromDate}</td>`
      );
      row.append(
        `<td data-f-name="Arial" data-f-sz="9"  data-a-h="center" data-a-v="middle" 	data-b-a-s="thin" data-b-a-c="000000">${item.toDate}</td>`
      );
      row.append(
        `<td data-f-name="Arial" data-f-sz="9"  data-a-h="center" data-a-v="middle" 	data-b-a-s="thin" data-b-a-c="000000">${item.duration}</td>`
      );
      row.append(
        `<td data-f-name="Arial" data-f-sz="9"  data-a-h="center" data-a-v="middle" 	data-b-a-s="thin" data-b-a-c="000000">${item.pastOne}</td>`
      );
      if (editAccess === true) {
        row.append(`<td data-exclude="true">                            <div class="d-flex gap-3">
          <button
            class="btn-edit"
            title="Edit Entry"
            
          >
          <i class='bx bxs-edit fs-5' ></i>
          </button>
          <button
            class="btn-delete"
            title="Delete Entry"
            data-bs-toggle="modal"
            data-bs-target="#deleteEntry"
          >
            <i class="bx bx-trash fs-5"></i>
          </button>
        </div></td>`);
      }

      tableBody.append(row);
    });
  }
}
function getDispatchDays() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "php/check_duration.php",
      data: {
        empID: empID,
      },
      success: function (response) {
        const dDays = response;
        resolve(dDays);
      },
      error: function (xhr, status, error) {
        if (xhr.status === 404) {
          reject("Not Found Error: The requested resource was not found.");
        } else if (xhr.status === 500) {
          reject("Internal Server Error: There was a server error.");
        } else {
          reject("An unspecified error occurreds.");
        }
      },
    });
  });
}
function displayDays(dd) {
  var countText = "";
  if (dd == 1) {
    countText = `1 day`;
  } else {
    countText = `${dd} days`;
  }
  $("#dCount").text(countText);
  setBar(dd);
  colorBar(dd);
}
function saveStat() {
  const disStat = $("#dispatchStatus").val();
  $.ajax({
    type: "POST",
    url: "php/update_dispatch_status.php",
    data: {
      empID: empID,
      dispatch: disStat,
    },
    success: function (response) {
      getEmployeeDetails()
        .then((emps) => {
          fillDetails(emps);
          $("#cancelStat").click();
        })
        .catch((error) => {
          alert(`${error}`);
        });
    },
    error: function (xhr, status, error) {
      if (xhr.status === 404) {
        reject("Not Found Error: The requested resource was not found.");
      } else if (xhr.status === 500) {
        reject("Internal Server Error: There was a server error.");
      } else {
        reject("An unspecified error occurreds.");
      }
    },
  });
}
function deleteDispatch() {
  const delID = $("#storeId").attr("del-id");
  $.ajax({
    type: "POST",
    url: "php/delete_dispatch_history.php",
    data: {
      dispatchID: delID,
    },
    success: function (response) {
      Promise.all([getDispatchHistory(), getDispatchDays(), getYearly()])
        .then(([dlst, dd, yrl]) => {
          dHistory = dlst;
          fillHistory(dHistory);
          displayDays(dd);
          fillYearly(yrl);
          $("#deleteEntry .btn-close").click();
        })
        .catch((error) => {
          alert(`${error}`);
        });
    },
    error: function (xhr, status, error) {
      if (xhr.status === 404) {
        reject("Not Found Error: The requested resource was not found.");
      } else if (xhr.status === 500) {
        reject("Internal Server Error: There was a server error.");
      } else {
        reject("An unspecified error occurreds.");
      }
    },
  });
}
function setBar(dd) {
  const wd = (dd / full) * 100;
  $("#progBar").css("width", `${wd}%`);
}
function colorBar(dd) {
  $("#daysWarning").addClass("d-none");
  if (dd >= full) {
    $("#progBar").addClass("bg-danger").removeClass("bg-success bg-warning");
    if (dd > full) {
      $("#daysWarning").removeClass("d-none");
    }
  } else if (dd >= 150 && dd < full) {
    $("#progBar").addClass("bg-warning").removeClass("bg-success bg-danger");
  } else {
    $("#progBar").addClass("bg-success").removeClass("bg-warning bg-danger");
  }
}
function savePass() {
  const passNo = $("#upPassNo").val();
  const passBday = $("#upPassBday").val();
  const passIssue = $("#upPassIssue").val();
  const passExp = $("#upPassExp").val();
  const fPath = $("#upPassAttach")[0].files[0];
  const upload = $("#upPassAttach").val();
  const extension = upload.slice(((upload.lastIndexOf(".") - 1) >>> 0) + 2);
  if (fPath) {
    if (extension.toLowerCase() !== "pdf") {
      alert("Please attach PDF files only");
      $("#upPassAttach").val("");
      return;
    }
  }

  if (!passNo) {
    $("#upPassNo").addClass("border border-danger");
  }
  if (!passBday) {
    $("#upPassBday").addClass("border border-danger");
  }
  if (!passIssue) {
    $("#upPassIssue").addClass("border border-danger");
  }
  if (!passExp) {
    $("#upPassExp").addClass("border border-danger");
  }

  if (!passNo || !passBday || !passIssue || !passExp) {
    // console.log("may empty");
    return;
  }
  const startDate = new Date(passIssue);
  const endDate = new Date(passExp);
  if (endDate < startDate) {
    alert("Expiry must not be earlier than date of issue.");
    $("#upPassExp").val("");
    return;
  }
  var fd = new FormData();
  fd.append("fileValue", fPath);
  fd.append("empID", empID);
  fd.append("number", passNo);
  fd.append("birthdate", passBday);
  fd.append("issued", passIssue);
  fd.append("expiry", passExp);
  $.ajax({
    type: "POST",
    url: "php/update_passport.php",
    data: fd,
    contentType: false,
    cache: false,
    processData: false,
    success: function (response) {
      getPassport(true)
        .then((pport) => {
          userPassD = pport;
          passportDisplay(userPassD);
          resetPassInput();
          // $("#updatePass .btn-close").click();
        })
        .catch((error) => {
          alert(`${error}`);
        });
      getPassport(false)
        .then((pport) => {
          userPassI = pport;
          passportInput(userPassI);
          resetPassInput();
          // $("#updatePass .btn-close").click();
        })
        .catch((error) => {
          alert(`${error}`);
        });
    },
    error: function (xhr, status, error) {
      if (xhr.status === 404) {
        reject("Not Found Error: The requested resource was not found.");
      } else if (xhr.status === 500) {
        reject("Internal Server Error: There was a server error.");
      } else {
        reject("An unspecified error occurreds.");
      }
    },
  });
}
function resetPassInput() {
  passportDisplay(userPassD);
  passportInput(userPassI);
  $("#upPassNo").attr("disabled", true);
  $("#upPassBday").attr("disabled", true);
  $("#upPassIssue").attr("disabled", true);
  $("#upPassExp").attr("disabled", true);
  $("#upPassAttach").attr("disabled", true);
  $(".attach").addClass("d-none");
  $("#upPassExp, #upPassIssue, #upPassBday, #upPassNo ").removeClass(
    "border border-danger"
  );
  $("#updatePass .btn-close").closest(".modal").find(".modal-footer").html(`
  <button type="button" class="btn btn-cancel btn-secondary">
  Cancel
</button>
<button type="button" class="btn btn-update" id="btn-updatePass">
  Update Passport
</button>
  `);
}
function saveVisa() {
  const visaNo = $("#upVisaNo").val();
  const visaIssue = $("#upVisaIssue").val();
  const visaExp = $("#upVisaExp").val();
  const fPath = $("#upVisaAttach")[0].files[0];
  const upload = $("#upVisaAttach").val();
  const extension = upload.slice(((upload.lastIndexOf(".") - 1) >>> 0) + 2);
  if (fPath) {
    if (extension.toLowerCase() !== "pdf") {
      alert("Please attach PDF files only");
      $("#upVisaAttach").val("");
      return;
    }
  }
  if (!visaNo) {
    $("#upVisaNo").addClass("border border-danger");
  }
  if (!visaIssue) {
    $("#upVisaIssue").addClass("border border-danger");
  }
  if (!visaExp) {
    $("#upVisaExp").addClass("border border-danger");
  }

  if (!visaNo || !visaIssue || !visaExp) {
    // console.log("may empty");
    return;
  }
  const startDate = new Date(visaIssue);
  const endDate = new Date(visaExp);
  if (endDate < startDate) {
    alert("End date must not be earlier than start date.");
    $("#upVisaExp").val("");
    return;
  }
  var fd = new FormData();
  fd.append("fileValue", fPath);
  fd.append("empID", empID);
  fd.append("number", visaNo);
  fd.append("issued", visaIssue);
  fd.append("expiry", visaExp);
  $.ajax({
    type: "POST",
    url: "php/update_visa.php",
    data: fd,
    contentType: false,
    cache: false,
    processData: false,
    success: function (response) {
      getVisa(true)
        .then((vsa) => {
          userVisaD = vsa;
          visaDisplay(userVisaD);
          resetVisaInput();
          // $("#updateVisa .btn-close").click();
        })
        .catch((error) => {
          alert(`${error}`);
        });
      getVisa(false)
        .then((vsa) => {
          userVisaI = vsa;
          visaInput(userVisaI);
          resetVisaInput();
          // $("#updateVisa .btn-close").click();
        })
        .catch((error) => {
          alert(`${error}`);
        });
    },
    error: function (xhr, status, error) {
      if (xhr.status === 404) {
        reject("Not Found Error: The requested resource was not found.");
      } else if (xhr.status === 500) {
        reject("Internal Server Error: There was a server error.");
      } else {
        reject("An unspecified error occurreds.");
      }
    },
  });
}
function resetVisaInput() {
  visaDisplay(userVisaD);
  visaInput(userVisaI);
  $("#upVisaNo").attr("disabled", true);
  $("#upVisaIssue").attr("disabled", true);
  $("#upVisaExp").attr("disabled", true);
  $("#upVisaAttach").attr("disabled", true);
  $(".attach").addClass("d-none");
  $("#upVisaNo, #upVisaIssue, #upVisaExp").removeClass("border border-danger");
  $("#updateVisa .btn-close").closest(".modal").find(".modal-footer").html(`
  <button type="button" class="btn btn-cancel btn-secondary">
  Cancel
</button>
<button type="button" class="btn btn-update" id="btn-updateVisa">
  Update Visa
</button>
  `);
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

function checkEditAccess() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: "php/check_edit_permission.php",
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

function saveEditEntry() {
  var loc = $("#editentryLocation").val();
  var dateJapan = $("#editentryDateJ").val();
  var datePh = $("#editentryDateP").val();

  // var fd = new FormData();
  // fd.append("location", loc);
  // fd.append("dateJapan", dateJapan);
  // fd.append("datePh", datePh);

  // $.ajax({
  //   type: "POST",
  //   url: "",
  //   data: fd,
  //   contentType: false,
  //   cache: false,
  //   processData: false,
  //   success: function (response) {
  //     $("#btn-saveEntry").closest(".modal").find(".btn-close").click();
  //   },
  // });
  const editID = $("#btn-saveEntry").attr("e-id");
  $.ajax({
    type: "POST",
    url: "php/update_dispatch_history.php",
    data: {
      dispatchID: editID,
      locID: loc,
      dateFrom: dateJapan,
      dateTo: datePh,
    },
    success: function (response) {
      Promise.all([getDispatchHistory(), getDispatchDays(), getYearly()])
        .then(([dlst, dd, yrl]) => {
          dHistory = dlst;
          fillHistory(dHistory);
          displayDays(dd);
          fillYearly(yrl);
          $("#btn-saveEntry").closest(".modal").find(".btn-close").click();
        })
        .catch((error) => {
          alert(`${error}`);
        });
    },
    error: function (xhr, status, error) {
      if (xhr.status === 404) {
        reject("Not Found Error: The requested resource was not found.");
      } else if (xhr.status === 500) {
        reject("Internal Server Error: There was a server error.");
      } else {
        reject("An unspecified error occurreds.");
      }
    },
  });
}
function computeTotalDays() {
  var from = new Date($("#editentryDateJ").val());
  var to = new Date($("#editentryDateP").val());

  if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
    var differenceInTime = to.getTime() - from.getTime();
    var differenceInDays =
      Math.round(differenceInTime / (1000 * 3600 * 24)) + 1;

    $("#editentryDays").html(differenceInDays);
  }
}
function getEditDetails(editID) {
  const editItem = dHistory.find((item) => parseInt(item.id) === editID);
  var loc = editItem["locationName"];
  var japan = editItem["fromDate"];
  var parsedDateJap = new Date(japan);

  var formattedDateJap =
    parsedDateJap.getFullYear() +
    "-" +
    ("0" + (parsedDateJap.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + parsedDateJap.getDate()).slice(-2);
  var ph = editItem["toDate"];
  var parsedDatePh = new Date(ph);
  var formattedDatePh =
    parsedDatePh.getFullYear() +
    "-" +
    ("0" + (parsedDatePh.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + parsedDatePh.getDate()).slice(-2);

  var total = editItem["duration"];
  var totalpast = editItem["pastOne"];

  $("#editentryDateJ").val(formattedDateJap);
  $("#editentryDateJ").attr("max", formattedDatePh);
  $("#editentryDateP").val(formattedDatePh);
  $("#editentryDateP").attr("min", formattedDateJap);
  $("#editentryLocation option:contains(" + loc + ")").prop("selected", true);
  $(" #editentryDays").html(total);
}
function getYearly() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "php/get_yearly.php",
      data: {
        empID: empID,
      },
      dataType: "json",
      success: function (response) {
        const yrly = response;
        resolve(yrly);
      },
      error: function (xhr, status, error) {
        if (xhr.status === 404) {
          reject("Not Found Error: The requested resource was not found.");
        } else if (xhr.status === 500) {
          reject("Internal Server Error: There was a server error.");
        } else {
          reject("An unspecified error occurred.3");
        }
      },
    });
  });
}

function fillYearly(yrl) {
  var x = 1;
  var yrRow = `<tr class='d-none'></tr><tr class='d-none'>
  <tr class='d-none'><td data-f-name='Arial' data-f-sz='9' data-f-bold='true' data-a-h='center' data-a-v='middle' data-b-a-s='thin' data-b-a-c='000000'>Year</td>
  <td data-f-name="Arial" data-f-sz="9" data-f-bold="true" data-a-h="center" data-a-v="middle" 	data-b-a-s="thin" data-b-a-c="000000">Total Days in Japan</td> </tr>`;
  Object.entries(yrl).forEach(([key, value]) => {
    $(`#y${x}`).text(key);
    $(`#y${x}-days`).text(value);

    yrRow += `<tr class='d-none'><td data-f-name='Arial' data-f-sz='9' data-a-h='center' data-a-v='middle' data-b-a-s='thin' data-b-a-c='000000'>${key}</td><td data-f-name='Arial' data-f-sz='9' data-a-h='center' data-a-v='middle' data-b-a-s='thin' data-b-a-c='000000'>${value}</td></tr>`;
    x++;
  });
  $("#histTable").append(yrRow);
}
function getYears() {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  const nextYear = currentYear + 1;
  $("#y1").text(previousYear);
  $("#y2").text(currentYear);
  $("#y3").text(nextYear);
}
function exportTable() {
  TableToExcel.convert(document.getElementById("histTable"), {
    name: `Dispatch_History_${empID}.xlsx`,
    sheet: {
      name: `${ename}`,
    },
  });
}
function getLocations() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: "php/get_location.php",
      dataType: "json",
      success: function (response) {
        const locs = response;
        resolve(locs);
      },
      error: function (xhr, status, error) {
        if (xhr.status === 404) {
          reject("Not Found Error: The requested resource was not found.");
        } else if (xhr.status === 500) {
          reject("Internal Server Error: There was a server error.");
        } else {
          reject("An unspecified error occurred.2");
        }
      },
    });
  });
}
function fillLocations(locs) {
  var locSelect = $("#editentryLocation");
  locSelect.empty();
  $.each(locs, function (index, item) {
    var option = $("<option>")
      .attr("value", item.id)
      .text(item.name)
      .attr("loc-id", item.id);
    locSelect.append(option);
  });
}
//#endregion
