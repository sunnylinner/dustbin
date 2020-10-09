// document.body.ondragstart= ()=>{
//   // return false
// }

let temp = false;


// document.querySelector('.drag')
document.body
.ondragstart = (event) => {
  if (event.target instanceof Element && event.target.matches('.drag1')) {
    // 使其半透明
    event.target.style.opacity = .5;
    console.log(event);
    event.dataTransfer.setData('text123', event.target.innerText);

    const element = document.createElement("div");
    // element.appendChild(document.createTextNode("!@#$%^&*"));
    element.innerHTML='这是新创建的div';
    element.style.backgroundColor='pink';
    element.style.width = '100px';
    element.style.height = '200px';
    document.body.appendChild(element);
    // const element = new Image();
    // element.src = './zn.jpg';
    // event.dataTransfer.setDragImage(element, 0, 0);
    // event.dataTransfer.setDragImage(event.target, 0, 0);

    temp = true;
    return true;
  } else {
    return false;
  }
}

// document.querySelector('.drag').addEventListener('dragstart', (event) => {
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

document.querySelector('.drag').addEventListener('dragend', (event) => {
  if (temp && event.target.matches('.drag1')) {
    // 重置透明度
    event.target.style.opacity = "";
    console.log(event.dataTransfer.getData('text'));
  }
  temp = false;
})

document.querySelector('.drop').addEventListener('dragover', (event) => {
  event.preventDefault();
})

document.querySelector('.drop').addEventListener('dragenter', (event) => {
  if (temp && event.target.matches('.drop1')) {
    event.target.style.borderColor = "blue";
    console.log(event);
  }
})

document.querySelector('.drop').addEventListener('dragleave', (event) => {
  if (temp &&event.target.matches('.drop1')) {
    event.target.style.borderColor = "red";
    console.log(event);
  }
})

document.querySelector('.drop').addEventListener('drop', (event) => {
  event.preventDefault();
  if (event.target.matches('.drop1') && temp) {
    console.log('success');
    event.target.style.borderColor = "red";
    console.log(event);
    console.log(event.dataTransfer.getData('text123'));
  }
})

setTimeout(() => {
  document.querySelector('.drag').insertAdjacentHTML('beforeend', '<div class="drag1">Hello World</div>');
}, 1000)