// display:none on page loader after animation

var pageLoader = document.querySelector('.page-loader')
window.onload = function () {
  setTimeout(() => {
    pageLoader.classList.add('hide-pageLoader')
  }, 7900)
}

// IO one - intro car

const introCar = document.querySelector('.intro-car')

observer = new IntersectionObserver((entries) => {
  console.log(entries)

  if (entries[0].intersectionRatio > 0) {
    entries[0].target.style.animation = `carIntro 1.6s ease 2.6s`
  } else {
    entries[0].target.style.animation = 'none'
  }
})

observer.observe(introCar)

introCar.addEventListener('animationend', () => {
  introCar.classList.add('show')
})

// IO multiple - svg markers

const svgMarkers = document.querySelectorAll('.svgMarker')
const svgLines = document.querySelectorAll('.line')

observer = new IntersectionObserver((entries) => {
  console.log(entries)

  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0) {
      entry.target.classList.add('animate')
    } else {
      entry.target.classList.remove('animate')
    }
  })
})

svgMarkers.forEach((svgMarker) => {
  observer.observe(svgMarker)
})

// IO one - engine

const engineImg = document.querySelector('.engine-img')

observer = new IntersectionObserver((entries) => {
  console.log(entries)

  if (entries[0].intersectionRatio > 0) {
    entries[0].target.style.animation = `listCurve 1s ease`
  } else {
    entries[0].target.style.animation = 'none'
  }
})

observer.observe(engineImg)

// IO one - engine text

// const engineText = document.querySelector('.engine-text')

// observer = new IntersectionObserver((entries) => {
//   console.log(entries)

//   if (entries[0].intersectionRatio > 0) {
//     entries[0].target.style.animation = `colorCh 1.4s ease`
//   } else {
//     entries[0].target.style.animation = 'none'
//   }
// })

// observer.observe(engineText)

//intro text animation

carsCars = document.querySelector('.carscars')
bestCars = document.querySelector('.bestcars')
carsCars.innerHTML = carsCars.innerText
  .split('')
  .map((ltr, idx) => {
    return `<span class="ltr" style="--delay1: ${idx * 100}ms; --degZ: ${
      idx * 5
    }deg">${ltr}</span>`
  })
  .join('')

bestCars.innerHTML = bestCars.innerText
  .split('')
  .map((ltr, idx) => {
    return `<span class="ltr" style="--delay: ${(idx + 20) * 70}ms; --degZ: ${
      idx * 5
    }deg">${ltr}</span>`
  })
  .join('')

const ltrs = document.querySelectorAll('.ltr')
ltrs.forEach((ltr) => {
  ltr.addEventListener('animationend', () => {
    ltr.classList.add('show')
  })
})

const slider = document.querySelector('.slider-container')
//create array from nodelist, allows for extra methods to be applied to items inside
const slides = Array.from(document.querySelectorAll('.car-slide'))

//STATE VARIABLES

// yes/no is the user dragging/swiping
let isDragging = false,
  // mouse or finger start position for drag/swipe
  startPos = 0,
  // how far outside the viewport is the slide container from starting position
  currentTranslate = 0,
  // how far outside the viewport was the slide container before currentTranslate value
  prevTranslate = 0,
  // we will use a function to control animation (slide being swiped/dragged) before displaying final result of animation (new position of the slide after swiping/dragging). we use requestanimationframe() method for this, which also creates an ID to stop the animation. we will pass that ID into cancelAnimationFrame() method using this varible
  animationID = 0,
  // which slide are we looking at
  currentIndex = 0

//loop through slides
slides.forEach((slide, index) => {
  // put the image inside a variable
  const slideImage = slide.querySelector('img')
  // which someone starts to drag the image, prevent it from moving
  slideImage.addEventListener('dragstart', (e) => e.preventDefault())

  // TOUCH EVENTS

  // when finger touches screen, call touchStart() on current slide
  slide.addEventListener('touchstart', touchStart(index))
  // when finger leaves screen, call touchEnd()
  slide.addEventListener('touchend', touchEnd)
  // when finger on the device moving/swiping/dragging, call touchMove()
  slide.addEventListener('touchmove', touchMove)

  // MOUSE EVENTS

  // when mouse clicks down, call touchStart() on current slide
  slide.addEventListener('mousedown', touchStart(index))
  // when mouse click released, call touchEnd()
  slide.addEventListener('mouseup', touchEnd)
  // when mouse leaves slide, call touchEnd()
  slide.addEventListener('mouseleave', touchEnd)
  // when mouse moving/swiping/dragging, call touchMove() BUT we use an if statement in the function below to to remove functionality when the mouse is moving on slide but not swiping/dragging
  slide.addEventListener('mousemove', touchMove)
})

function touchStart(index) {
  // return gives us a value and we put a function in a function because we need to pass in the event
  return function (event) {
    //redeclare variable to match current state
    isDragging = true
    // set currentIndex variable to index of slide in view
    currentIndex = index
    // grab start position of finger/mouse on x-axis with function below
    startPos = getPositionX(event)
    // tell .requestAnimationFrame() which function to run, redeclare animationID variable by setting it to animation ID created by requestAnimationFrame
    animationID = requestAnimationFrame(animation)
    // change cursor when start to drag/swipe
    slider.classList.add('grabbing')
  }
}

function touchEnd() {
  //redeclare variable to match current state
  isDragging = false

  //stop animation when move finger/mouse off
  cancelAnimationFrame(animationID)

  //how far did slide container move from start to end
  const movedBy = currentTranslate - prevTranslate

  //if moved to left by more than 100 AND the current slide is not the last slide, increase index value by 1
  if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex += 1

  //if moved to right by more than 100px AND the current slide is not the first slide, decrease index value by 1
  if (movedBy > 100 && currentIndex > 0) currentIndex -= 1

  // use this function to change slide container position based on the currentIndex which we just increased/decreased, make sure a slide is centered in viewport when mouse/finger leaves
  setPositionByIndex()

  // change cursor back when stop drag/swipe
  slider.classList.remove('grabbing')
}

function touchMove(event) {
  // if boolean is currently true...
  if (isDragging) {
    // get current mouse/finger position
    const currentPos = getPositionX(event)
    //currentTranslate variable redeclared from 0. how far is slide container from start position based on where it was and how far finger/mouse moved it
    currentTranslate = prevTranslate + currentPos - startPos
  }
}

// grab start position with mouse or touch ON X-AXIS
function getPositionX(event) {
  return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX
}

function animation() {
  // this is what we are animating (css transform property) - but we are going to use this info in more than one place so we put it in a separate function and call it here
  setSliderPosition()
  // if dragging/swiping: repeat function/animation indefinitely
  if (isDragging) requestAnimationFrame(animation)
}

function setSliderPosition() {
  // change value of the css translateX property to current position of slide container, use the backticks instead of quotes if going to include a variable/expression into a string (called string interpolation)
  slider.style.transform = `translateX(${currentTranslate}px)`
}

function setPositionByIndex() {
  //set position of slider container in viewport
  currentTranslate = currentIndex * -window.innerWidth
  // so we can make this calculation again
  prevTranslate = currentTranslate
  //change the css translate value to current position
  setSliderPosition()
}
