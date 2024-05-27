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
var sortNum = 1;
var sortEmp = 4;
var sortKey = 1;
let empDetails = [];
//#endregion

// checkAccess()
//   .then((acc) => {
//     if (acc) {
//       $(document).ready(function () {
//         Promise.all([getGroups(), getEmployees()])
//           .then(([grps, emps]) => {
//             fillGroups(grps);
//             fillEmployees(emps);
//           })
//           .catch((error) => {
//             alert(`${error}`);
//           });
//       });
//     } else {
//       alert("Access denied");
//       window.location.href = `${rootFolder}`;
//     }
//   })
//   .catch((error) => {
//     alert(`${error}`);
//   });
checkAccess()
  .then((emp) => {
    if (emp.isSuccess) {
      empDetails = emp.data;
      $(document).ready(function () {
        fillEmployeeDetails();
        Promise.all([getGroups(), getEmployees()])
          .then(([grps, emps]) => {
            fillGroups(grps);
            fillEmployees(emps);
          })
          .catch((error) => {
            alert(`${error}`);
          });
      });
    } else {
      alert(emp.message);
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
$(document).on("click", ".sortEmpNum", function () {
  sortNum = sortNum === 1 ? 2 : 1;
  sortKey = sortNum;
  getEmployees()
    .then((emps) => {
      fillEmployees(emps);
    })
    .catch((error) => {
      alert(`${error}`);
    });
});
$(document).on("click", ".sortEmpName", function () {
  sortEmp = sortEmp === 3 ? 4 : 3;
  sortKey = sortEmp;
  getEmployees()
    .then((emps) => {
      fillEmployees(emps);
    })
    .catch((error) => {
      alert(`${error}`);
    });
});
$(document).on("click", "#addUser", function () {
  addUser();
});
$(document).on(
  "click",
  "#empId, #empFName, #empLName, #empGroup, #empAccess",
  function () {
    $(this).removeClass("border-[var(--red-color)] bg-red-200");
    $(this).siblings("small").addClass("hidden");
  }
);
$(document).on("click", "#addUserModal .btn-close", function () {
  resetAddModal();
});
$(document).on("click", ".close", function () {
  $(this).closest("modal").find(".btn-close").click();
});
$(document).on("click", ".btn-editUser", function () {
  var empnum = $(this).closest("tr").find("td:eq(0)").text();

  fillEditModal(empnum);
});
$(document).on("click", ".btn-removeUser", function () {
  var empnum = $(this).closest("tr").find("td:eq(0)").text();
  var empname = $(this).closest("tr").find("td:eq(1)").text();
  fillRemoveModal(empnum, empname);
});
//#endregion

//#region FUNCTIONS

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
        sortKey: sortKey,
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
    row.append(`<td></td>`);

    row.append(
      `<td>
        <div class="dropdown">
        <button class="" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <i class='bx bx-dots-vertical-rounded' ></i>
        </button>
        <ul class="dropdown-menu">
         <li><a class="dropdown-item flex gap-2 items-center btn-editUser" ><i class='bx bx-edit-alt' ></i>Edit</a></li>
         <li><a class="dropdown-item flex gap-2 items-center btn-removeUser"><i class='bx bx-trash text-[var(--red-color)]' ></i>Remove user</a></li>
        
        </ul>
    </div>
      </td>`
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
// function checkAccess() {
//   return new Promise((resolve, reject) => {
//     $.ajax({
//       type: "GET",
//       url: "php/check_permission.php",
//       dataType: "json",
//       success: function (data) {
//         const acc = data;
//         resolve(acc);
//       },
//       error: function (xhr, status, error) {
//         if (xhr.status === 404) {
//           reject("Not Found Error: The requested resource was not found.");
//         } else if (xhr.status === 500) {
//           reject("Internal Server Error: There was a server error.");
//         } else {
//           reject("An unspecified error occurred.");
//         }
//       },
//     });
//   });
// }
function checkAccess() {
  const response = {
    isSuccess: true,
    data: {
      id: 6969,
      group: "Systems Group",
      empname: {
        firstname: "Korin Kitto",
        surname: "Medurano",
      },
    },
  };
  // const response = {
  //   isSuccess: false,
  //   message: "Access Denied",
  // };
  // const response = {
  //   isSuccess: false,
  //   message: "Not logged in",
  // };
  return new Promise((resolve, reject) => {
    //   $.ajax({
    //     type: "GET",
    //     url: "global/check_login.php",
    //     dataType: "json",
    //     success: function (data) {
    //       const acc = data;
    //       resolve(acc);
    //     },
    //     error: function (xhr, status, error) {
    //       if (xhr.status === 404) {
    //         reject("Not Found Error: The requested resource was not found.");
    //       } else if (xhr.status === 500) {
    //         reject("Internal Server Error: There was a server error.");
    //       } else {
    //         reject("An unspecified error occurred.");
    //       }
    //     },
    //   });
    resolve(response);
  });
}
function fillEmployeeDetails() {
  const fName = empDetails.empname.firstname;
  const sName = empDetails.empname.surname;
  const initials = getInitials(fName, sName);
  const grpName = empDetails.group;
  $("#empLabel").html(`${fName} ${sName}`);
  $("#empInitials").html(`${initials}`);
  $("#grpLabel").html(`${grpName}`);
}
function getInitials(firstname, surname) {
  let initials = "";
  var firstInitial = firstname.charAt(0);
  var lastInitial = surname.charAt(0);
  initials = `${firstInitial}${lastInitial}`;
  return initials.toUpperCase();
}
function addUser() {
  var empId = $("#empId").val();
  var empFName = $("#empFName").val();
  var empLName = $("#empLName").val();
  var empGroup = $("#empGroup").val();
  var empAccess = $("#empAccess").val();
  var ctr = 0;

  if (!empId) {
    $("#empId").addClass("border-[var(--red-color)] bg-red-200");
    $("#empId").siblings("small").removeClass("hidden");
    ctr++;
  }
  if (!empFName) {
    $("#empFName").addClass("border-[var(--red-color)] bg-red-200");
    $("#empFName").siblings("small").removeClass("hidden");
    ctr++;
  }
  if (!empLName) {
    $("#empLName").addClass("border-[var(--red-color)] bg-red-200");
    $("#empLName").siblings("small").removeClass("hidden");
    ctr++;
  }
  if (!empGroup) {
    $("#empGroup").addClass("border-[var(--red-color)] bg-red-200");
    $("#empGroup").siblings("small").removeClass("hidden");
    ctr++;
  }
  if (!empAccess) {
    $("#empAccess").addClass("border-[var(--red-color)] bg-red-200");
    $("#empAccess").siblings("small").removeClass("hidden");
    ctr++;
  }

  if (ctr > 0) {
    return;
  } else {
    $("#addUserModal .btn-close").click();
  }
}
function resetAddModal() {
  var selectedG = $("#empGroup").children(":first").val();
  var selectedA = $("#empAccess").children(":first").val();
  $("#empId, #empFName, #empLName").val("");
  $("#empGroup").val(selectedG);
  $("#empAccess").val(selectedA);
  $("#empAccess , #empGroup, #empLName, #empFName, #empId")
    .siblings("small")
    .addClass("hidden");
  $("#empId, #empFName, #empLName, #empGroup, #empAccess").removeClass(
    "border-[var(--red-color)] bg-red-200"
  );
}
function fillEditModal(empnum) {
  $("#empIdEdit").val(empnum);
  $("#editUserModal").modal("show");
}
function fillRemoveModal(empnum, empname) {
  $("#removeId").text(empnum);
  $("#removeName").text(empname);
  $("#removeUserModal").modal("show");
}
//#endregion
