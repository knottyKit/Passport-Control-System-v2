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
//#endregion

checkAccess()
  .then((emp) => {
    console.log(emp);
    if (emp.isSuccess) {
      window.location.href = `${rootFolder}/PCSKHI/`;
    } else {
      $(document).ready(function () {
        animation();
      });
    }
  })
  .catch((error) => {
    alert(`${error}`);
  });

// animation();s
//#region BINDS
$(document).on("click", "#loginBtn", function () {
  Login()
    .then((res) => {
      if (res.isSuccess) {
        window.location.href = `${rootFolder}/PCSKHI/`;
        // alert(`${res.message}`);
        $("#userid").val("");
      } else {
        alert(`${res.message}`);
        $("#userid").val("");
      }
    })
    .catch((error) => {
      console.log(error);
    });
});
//#endregion

//#region FUNCTIONS
function checkAccess() {
  // const response = {
  //   isSuccess: true,
  //   data: {
  //     empNum: 464,
  //     empGroup: {
  //       id: 21,
  //       name: "System Group",
  //       acr: "SYS",
  //     },
  //     empName: {
  //       firstname: "Collene Keith",
  //       surname: "Medrano",
  //     },
  //   },
  // };
  // const response = {
  //   isSuccess: false,
  //   message: "Access Denied",
  // };
  // const response = {
  //   isSuccess: false,
  //   message: "Not logged in",
  // };
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: "../global/check_login.php",
      dataType: "json",
      success: function (data) {
        // console.log(data);
        const acc = data;
        resolve(acc);
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
function animation() {
  var animation = bodymovin.loadAnimation({
    container: document.getElementById("animationContainer"),
    renderer: "svg", // Choose the renderer (svg, canvas, html)
    loop: true, // Whether the animation should loop
    autoplay: true, // Whether the animation should start automatically
    path: "../animation.json", // Path to your animation JSON file
    speed: 1, // Adjust animation speed (1 for normal speed)
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet", // Set how the animation fits inside the container
    },
  });

  // Add a delay after each loop completes
  animation.addEventListener("loopComplete", function () {
    setTimeout(function () {
      animation.pause(); // Pause the animation
      setTimeout(function () {
        animation.play(); // Resume the animation after the delay
      }, 3000); // 3-second delay (3000 milliseconds)
    }, 0); // No delay to pause immediately
  });
}
function Login() {
  const userID = $("#userid").val();
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "php/login.php",
      data: {
        khiID: userID,
      },
      dataType: "json",
      success: function (response) {
        const result = response;
        resolve(result);
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
//#endregion
