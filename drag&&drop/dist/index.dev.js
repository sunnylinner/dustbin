"use strict";

// document.body.ondragstart= ()=>{
//   // return false
// }
var temp = false; // document.querySelector('.drag')

document.body.ondragstart = function (event) {
  if (event.target instanceof Element && event.target.matches('.drag1')) {
    // 使其半透明
    event.target.style.opacity = .5;
    console.log(event);
    event.dataTransfer.setData('text123', event.target.innerText);
    var element = document.createElement("div"); // element.appendChild(document.createTextNode("!@#$%^&*"));

    element.innerHTML = '这是新创建的div';
    element.style.backgroundColor = 'pink';
    element.style.width = '100px';
    element.style.height = '200px';
    document.body.appendChild(element); // const element = new Image();
    // element.src = './zn.jpg';
    // event.dataTransfer.setDragImage(element, 0, 0);
    // event.dataTransfer.setDragImage(event.target, 0, 0);

    temp = true;
    return true;
  } else {
    return false;
  }
}; // document.querySelector('.drag').addEventListener('dragstart', (event) => {
//   if (event.target instanceof Element && event.target.matches('.drag1')) {
//     // 使其半透明
//     event.target.style.opacity = .5;
//     console.log(event);
//     event.dataTransfer.setData('text123', event.target.innerText);
//     const element = document.createElement("div");
//     // element.appendChild(document.createTextNode("!@#$%^&*"));
//     element.innerHTML='这是新创建的div';
//     element.style.backgroundColor='pink';
//     element.style.width = '100px';
//     element.style.height = '200px';
//     document.body.appendChild(element);
//     // const element = new Image();
//     // element.src = './zn.jpg';
//     // event.dataTransfer.setDragImage(element, 0, 0);
//     // event.dataTransfer.setDragImage(event.target, 0, 0);
//     temp = true;
//     return true;
//   } else {
//     return false;
//   }
// })


document.querySelector('.drag').addEventListener('dragend', function (event) {
  if (temp && event.target.matches('.drag1')) {
    // 重置透明度
    event.target.style.opacity = "";
    console.log(event.dataTransfer.getData('text'));
  }

  temp = false;
});
document.querySelector('.drop').addEventListener('dragover', function (event) {
  event.preventDefault();
});
document.querySelector('.drop').addEventListener('dragenter', function (event) {
  if (temp && event.target.matches('.drop1')) {
    event.target.style.borderColor = "blue";
    console.log(event);
  }
});
document.querySelector('.drop').addEventListener('dragleave', function (event) {
  if (temp && event.target.matches('.drop1')) {
    event.target.style.borderColor = "red";
    console.log(event);
  }
});
document.querySelector('.drop').addEventListener('drop', function (event) {
  event.preventDefault();

  if (event.target.matches('.drop1') && temp) {
    console.log('success');
    event.target.style.borderColor = "red";
    console.log(event);
    console.log(event.dataTransfer.getData('text123'));
  }
});
setTimeout(function () {
  document.querySelector('.drag').insertAdjacentHTML('beforeend', '<div class="drag1">Hello World</div>');
}, 1000);