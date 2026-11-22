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
     CLASS 11: Form validation (Practicum 10)
     - checks every field with checkValidity()
     - writes our own messages with setCustomValidity()
     - shows them under the field and on the browser bubble with reportValidity()
     - stops the normal submit with preventDefault()
     - shows a success message when everything is correct
     ---------------------------------------------------------- */
  var form = document.getElementById('regForm');
  var submitBtn = document.getElementById('submitBtn');
  var fields = form.querySelectorAll('.field');             // every field box
  var formError = document.getElementById('formError');
  var formErrorText = document.getElementById('formErrorText');
  var formSuccess = document.getElementById('formSuccess');

  /* Returns the first input / select / textarea of a field box */
  function getControl(box) {
    return box.querySelector('input, select, textarea');
  }

  /* Returns the name of a field (the label text without the star) */
  function getName(box) {
    var label = box.querySelector('label[for], .group-label');
    return label ? label.textContent.replace('*', '').trim() : 'This field';
  }

  /* ---- CLASS 11.1: extra rules that HTML attributes cannot express ---- */
  function customRules(box, control) {
    var id = control.id;

    // confirm password must match the password
    if (id === 'confirm' && control.value !== document.getElementById('password').value) {
      return 'Passwords do not match';
    }

    // at least one skill must be selected
    if (box.dataset.group === 'skills' &&
        box.querySelectorAll('input:checked').length === 0) {
      return 'Please select at least one skill';
    }

    // resume: only pdf / doc / docx and below 2 MB
    if (id === 'resume' && control.files.length > 0) {
      var file = control.files[0];
      if (!/\.(pdf|docx?)$/i.test(file.name)) {
        return 'Only PDF or Word files are allowed';
      }
      if (file.size > 2 * 1024 * 1024) {
        return 'File is too large. Maximum size is 2 MB';
      }
    }

    // minimum CGPA depends on the department (same as the eligibility table)
    if (id === 'cgpa' && control.value !== '' && control.validity.valid) {
      var dept = document.getElementById('dept').value;
      var minCgpa = (dept === 'cse' || dept === 'it') ? 6.5 : 6.0;
      if (parseFloat(control.value) < minCgpa) {
        return 'Minimum CGPA for this department is ' + minCgpa.toFixed(1);
      }
    }

    return '';                                     // no custom problem
  }

  /* ---- CLASS 11.2: message for each type of mistake ---- */
  function getMessage(box, control) {
    var v = control.validity;
    var name = getName(box);

    if (v.customError)      { return control.validationMessage; }
    if (v.valueMissing)     { return (control.type === 'checkbox' || control.type === 'radio' || control.tagName === 'SELECT')
                                      ? 'Please choose an option for ' + name
                                      : name + ' is required'; }
    if (v.typeMismatch)     { return 'Please enter a valid ' + (control.type === 'email' ? 'email address' : 'web link (starting with https://)'); }
    if (v.patternMismatch)  { return PATTERN_MESSAGES[control.id] || 'Please match the requested format'; }
    if (v.tooShort)         { return name + ' needs at least ' + control.minLength + ' characters'; }
    if (v.tooLong)          { return name + ' can have only ' + control.maxLength + ' characters'; }
    if (v.rangeUnderflow)   { return name + ' must be ' + control.min + ' or more'; }
    if (v.rangeOverflow)    { return name + ' must be ' + control.max + ' or less'; }
    if (v.stepMismatch)     { return 'Please enter a valid value for ' + name; }
    return control.validationMessage;
  }

  var PATTERN_MESSAGES = {
    fullname: 'Use letters, spaces and dots only',
    regno: 'Use the format 21CS1234 (year, department, number)',
    phone: 'Enter a 10-digit number starting with 6, 7, 8 or 9',
    password: 'Use at least 8 characters with letters and numbers',
    link: 'The link must start with http:// or https://'
  };

  /* ---- CLASS 11.3: validate one field box ---- */
  function validateField(box) {
    var control = getControl(box);
    var error = box.querySelector('.error-msg');

    control.setCustomValidity('');                  // clear the old custom message
    var custom = customRules(box, control);
    if (custom) {
      control.setCustomValidity(custom);            // our own message
    }

    var ok = control.checkValidity();               // true when the field is correct

    if (ok) {
      error.textContent = '';
      error.classList.remove('show');
    } else {
      error.textContent = getMessage(box, control);
      error.classList.add('show');
    }

    // classes for the radio / checkbox groups (they cannot use :valid / :invalid)
    box.classList.toggle('invalid', !ok);
    box.classList.toggle('valid', ok);
    control.setAttribute('aria-invalid', !ok);
    return ok;
  }

  /* ---- CLASS 11.4: progress bar ---- */
  var progressBar = document.getElementById('progressBar');
  var progressText = document.getElementById('progressText');

  function updateProgress() {
    var total = 0, done = 0;

    fields.forEach(function (box) {
      var control = getControl(box);
      if (!control.required && box.dataset.group !== 'skills') { return; }   // skip optional
      total++;

      control.setCustomValidity('');
      var custom = customRules(box, control);
      if (custom) { control.setCustomValidity(custom); }
      if (control.checkValidity()) { done++; }
    });

    progressBar.style.width = (total ? (done / total) * 100 : 0) + '%';
    progressText.textContent = done + ' of ' + total + ' required fields completed';
  }

  /* ---- CLASS 11.5: password strength meter ---- */
  var passwordInput = document.getElementById('password');
  var strengthBar = document.getElementById('strengthBar');
  var strengthText = document.getElementById('strengthText');

  passwordInput.addEventListener('input', function () {
    var value = passwordInput.value;
    var score = 0;
    if (value.length >= 8) { score++; }
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) { score++; }
    if (/\d/.test(value)) { score++; }
    if (/[^A-Za-z0-9]/.test(value)) { score++; }

    strengthBar.className = value ? 's' + Math.max(score, 1) : '';
    strengthText.textContent = value ? ['', 'Weak', 'Fair', 'Good', 'Strong'][Math.max(score, 1)] + ' password'
                                     : 'Use letters and numbers';

    // the confirm box must be checked again when the password changes
    var confirmBox = document.getElementById('confirm').closest('.field');
    if (confirmBox.classList.contains('touched')) { validateField(confirmBox); }
  });

  /* ---- CLASS 11.6: character counter for About You ---- */
  var about = document.getElementById('aboutme');
  var aboutCount = document.getElementById('aboutCount');

  about.addEventListener('input', function () {
    aboutCount.textContent = about.value.length + ' / ' + about.maxLength;
    aboutCount.classList.toggle('limit', about.value.length >= about.maxLength - 20);
  });

  /* ---- CLASS 11.7: live checking while the student types ---- */
  fields.forEach(function (box) {
    box.querySelectorAll('input, select, textarea').forEach(function (control) {

      // when the student leaves the field, start showing red / green
      control.addEventListener('blur', function () {
        box.classList.add('touched');
        validateField(box);
        updateProgress();
      });

      // after that, check again on every change
      ['input', 'change'].forEach(function (eventName) {
        control.addEventListener(eventName, function () {
          if (eventName === 'change') { box.classList.add('touched'); }
          if (box.classList.contains('touched')) { validateField(box); }
          updateProgress();
        });
      });
    });
  });

  // changing the department re-checks the CGPA rule
  document.getElementById('dept').addEventListener('change', function () {
    var cgpaBox = document.getElementById('cgpa').closest('.field');
    if (cgpaBox.classList.contains('touched')) { validateField(cgpaBox); }
    updateProgress();
  });

  /* ---- CLASS 11.8: submit ---- */
  form.addEventListener('submit', function (event) {
    event.preventDefault();                          // never reload the page
    formSuccess.classList.remove('show');

    var firstBad = null;
    var badCount = 0;

    fields.forEach(function (box) {
      box.classList.add('touched');
      if (!validateField(box)) {
        badCount++;
        if (!firstBad) { firstBad = getControl(box); }
      }
    });

    if (badCount > 0) {
      // show the summary, then move to the first mistake
      formErrorText.textContent = 'Please correct ' + badCount + (badCount === 1 ? ' field' : ' fields') + ' before submitting.';
      formError.classList.remove('show');
      setTimeout(function () { formError.classList.add('show'); }, 20);   // restart animation

      firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstBad.focus({ preventScroll: true });
      firstBad.reportValidity();                     // browser bubble on the first mistake

      showToast('Some fields need your attention', 'error');
      return;
    }

    // everything is valid: show the spinner, then the success message
    formError.classList.remove('show');
    submitBtn.classList.add('loading');

    setTimeout(function () {
      var name = document.getElementById('fullname').value.trim();
      var regno = document.getElementById('regno').value.toUpperCase();
      var ref = 'PP' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

      document.getElementById('successTitle').textContent = 'Thank you, ' + name + '!';
      document.getElementById('successText').textContent =
        'Registration submitted for ' + regno + '. Your reference number is ' + ref + '.';

      submitBtn.classList.remove('loading');
      form.reset();                                  // clear the form
      formSuccess.classList.add('show');
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      showToast('Registration submitted successfully!', 'success');
    }, 1500);
  });

  /* ---- CLASS 11.9: reset button and "register another" button ---- */
  form.addEventListener('reset', function () {
    setTimeout(function () {                         // wait until the browser clears the values
      fields.forEach(function (box) {
        box.classList.remove('touched', 'valid', 'invalid');
        box.querySelector('.error-msg').classList.remove('show');
        getControl(box).setCustomValidity('');
      });
      formError.classList.remove('show');
      strengthBar.className = '';
      strengthText.textContent = 'Use letters and numbers';
      aboutCount.textContent = '0 / ' + about.maxLength;
      updateProgress();
    }, 0);
  });

  document.getElementById('anotherBtn').addEventListener('click', function () {
    formSuccess.classList.remove('show');
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  updateProgress();                                  // show 0 of N when the page opens


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