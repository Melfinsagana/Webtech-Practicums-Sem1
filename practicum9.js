/* ==========================================================
   College Placement Portal - Practicum 9
   Animated and interactive features

   Methods used in this file:
     addEventListener()  - listens for clicks, scroll, keys, submit
     classList.add()     - adds a CSS class (starts an animation)
     classList.remove()  - removes a CSS class
     classList.toggle()  - adds the class if missing, removes it if present
     setTimeout()        - runs code after a delay (in milliseconds)
   The animations themselves are written in style.css (section 17).
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------------------------
     CLASS 1: Toast notification
     showToast(message, type) slides a small message in from the right
     and hides it again after 3 seconds.
     type can be 'success', 'error' or 'info'.
     ---------------------------------------------------------- */
  var toast = document.getElementById('toast');
  var toastText = document.getElementById('toastText');
  var toastIcon = document.getElementById('toastIcon');
  var toastTimer;                                  // remembers the running timer

  function showToast(message, type) {
    type = type || 'success';
    toastText.textContent = message;
    toastIcon.innerHTML = (type === 'error') ? '&#10006;' : (type === 'info') ? '&#9432;' : '&#10004;';

    toast.classList.remove('error', 'info', 'show'); // reset the previous state
    if (type !== 'success') {
      toast.classList.add(type);                     // red or yellow border
    }

    clearTimeout(toastTimer);                        // stop an older timer
    setTimeout(function () {
      toast.classList.add('show');                   // slide in
    }, 30);

    toastTimer = setTimeout(function () {
      toast.classList.remove('show');                // slide out after 3 seconds
    }, 3000);
  }


  /* ----------------------------------------------------------
     CLASS 2: Scroll reveal
     Every section starts hidden (.reveal) and fades in
     (.visible) when it comes into view.
     ---------------------------------------------------------- */
  var sections = document.querySelectorAll('main section');

  sections.forEach(function (sec) {
    sec.classList.add('reveal');
  });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);          // animate only once
        }
      });
    }, { threshold: 0.12 });

    sections.forEach(function (sec) { observer.observe(sec); });
  } else {
    sections.forEach(function (sec) { sec.classList.add('visible'); });
  }


  /* ----------------------------------------------------------
     CLASS 3: Button press effect
     Every button gets a quick "pressed" animation when clicked.
     ---------------------------------------------------------- */
  document.querySelectorAll('button, .btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.classList.add('clicked');
      setTimeout(function () {
        btn.classList.remove('clicked');             // remove so it can play again
      }, 350);
    });
  });


  /* ----------------------------------------------------------
     CLASS 4: Company cards - View Details (open / close)
     toggle() opens the panel if it is closed and closes it if open.
     ---------------------------------------------------------- */
  document.querySelectorAll('.toggle-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = document.getElementById(btn.dataset.target);
      var isOpen = panel.classList.toggle('open');   // returns true when class was added

      btn.classList.toggle('active', isOpen);
      btn.setAttribute('aria-expanded', isOpen);
      btn.querySelector('.label').textContent = isOpen ? 'Hide Details' : 'View Details';
    });
  });


  /* ----------------------------------------------------------
     CLASS 5: FAQ accordion
     Only one answer stays open at a time.
     ---------------------------------------------------------- */
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    item.querySelector('.faq-q').addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');

      faqItems.forEach(function (other) {
        other.classList.remove('open');              // close all
      });

      if (!wasOpen) {
        item.classList.add('open');                  // open the clicked one
      }
    });
  });


  /* ----------------------------------------------------------
     CLASS 6: Notification bell
     Click opens / closes the panel, ringing the bell and
     removing the red counter.
     ---------------------------------------------------------- */
  var bellBtn = document.getElementById('bellBtn');
  var bellBadge = document.getElementById('bellBadge');
  var notifyPanel = document.getElementById('notifyPanel');

  bellBtn.addEventListener('click', function (event) {
    event.stopPropagation();                         // do not trigger the outside-click below
    notifyPanel.classList.toggle('open');
    bellBadge.classList.add('hidden');               // all notifications are now seen

    bellBtn.classList.add('ring');
    setTimeout(function () {
      bellBtn.classList.remove('ring');
    }, 800);
  });

  notifyPanel.querySelectorAll('.notify-item').forEach(function (item) {
    item.addEventListener('click', function () {
      showToast(item.querySelector('strong').textContent + ' reminder saved', 'info');
      notifyPanel.classList.remove('open');
    });
  });

  // clicking anywhere else closes the panel
  document.addEventListener('click', function (event) {
    if (!notifyPanel.contains(event.target)) {
      notifyPanel.classList.remove('open');
    }
  });


  /* ----------------------------------------------------------
     CLASS 7: Eligibility checker
     Reads CGPA and arrears, then opens the result card with a
     pop animation (eligible) or a shake animation (not eligible).
     ---------------------------------------------------------- */
  var chkBtn = document.getElementById('chkBtn');
  var chkResult = document.getElementById('chkResult');
  var chkIcon = document.getElementById('chkIcon');
  var chkText = document.getElementById('chkText');

  chkBtn.addEventListener('click', function () {
    var cgpa = parseFloat(document.getElementById('chkCgpa').value);
    var arrears = parseInt(document.getElementById('chkArrears').value, 10);

    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10 || isNaN(arrears) || arrears < 0) {
      showToast('Please enter a valid CGPA (0 to 10) and arrears', 'error');
      return;
    }

    chkResult.classList.remove('success', 'fail', 'pop');   // reset

    if (cgpa >= 6.5 && arrears === 0) {
      chkResult.classList.add('success');
      chkIcon.innerHTML = '&#127881;';
      chkText.textContent = 'Great! You are eligible for all upcoming campus drives.';
    } else if (cgpa < 6.5) {
      chkResult.classList.add('fail');
      chkIcon.innerHTML = '&#9888;';
      chkText.textContent = 'Not eligible yet. A minimum CGPA of 6.5 is required.';
    } else {
      chkResult.classList.add('fail');
      chkIcon.innerHTML = '&#9888;';
      chkText.textContent = 'Not eligible yet. Clear your standing arrears first.';
    }

    chkResult.classList.add('show');                 // open the card

    setTimeout(function () {
      chkResult.classList.add('pop');                // start the pop / shake animation
    }, 30);
  });


  /* ----------------------------------------------------------
     CLASS 8: Gallery lightbox (open / close a picture)
     ---------------------------------------------------------- */
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCaption = document.getElementById('lbCaption');
  var lbClose = document.getElementById('lbClose');

  function openLightbox(item) {
    var img = item.querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = item.querySelector('figcaption strong').textContent;
    lightbox.classList.add('open');
    document.body.classList.add('no-scroll');        // freeze page scrolling
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  document.querySelectorAll('.gallery-item').forEach(function (item) {
    item.addEventListener('click', function () {
      openLightbox(item);
    });
  });

  lbClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) {                 // click on the dark background
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {                    // Esc key closes everything
      closeLightbox();
      notifyPanel.classList.remove('open');
    }
  });


  /* ----------------------------------------------------------
     CLASS 9: Drive alert (bottom left)
     Slides in 1.5 seconds after the page loads, can be closed,
     and hides by itself after 12 seconds.
     ---------------------------------------------------------- */
  var driveAlert = document.querySelector('.drive-alert');
  var alertClose = document.getElementById('alertClose');

  setTimeout(function () {
    driveAlert.classList.add('show');
  }, 1500);

  setTimeout(function () {
    driveAlert.classList.remove('show');
  }, 12000);

  alertClose.addEventListener('click', function () {
    driveAlert.classList.remove('show');
  });


  /* ----------------------------------------------------------
     CLASS 10: Back-to-top button and Apply Now tab
     ---------------------------------------------------------- */
  var backTop = document.querySelector('.back-top');

  window.addEventListener('scroll', function () {
    // toggle(name, true/false) adds when true and removes when false
    backTop.classList.toggle('show', window.scrollY > 400);
  });

  document.querySelector('.apply-fixed').addEventListener('click', function () {
    showToast('Fill the registration form to apply', 'info');
  });


  /* ----------------------------------------------------------
     CLASS 11: Registration form submit
     Shows a spinner, then a success message, then clears the form.
     (The browser checks required fields before this event runs.)
     ---------------------------------------------------------- */
  var form = document.querySelector('#register form');
  var submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (event) {
    event.preventDefault();                          // stay on the page
    submitBtn.classList.add('loading');              // show the spinner

    setTimeout(function () {
      submitBtn.classList.remove('loading');
      showToast('Registration submitted successfully!', 'success');
      form.reset();
    }, 1500);
  });


  /* ----------------------------------------------------------
     CLASS 12: Mobile menu
     Closes the hamburger menu after a link is clicked.
     ---------------------------------------------------------- */
  var menuToggle = document.getElementById('menu-toggle');

  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      menuToggle.checked = false;
    });
  });

});