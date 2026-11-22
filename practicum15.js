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


  /* ==========================================================
     CLASS 13: API dashboard (Practicum 12)
     Gets JSON with fetch(), shows a loading indicator, handles
     errors and timeouts, and builds the table, chart and pages
     with createElement(), appendChild() and textContent.
     ========================================================== */

  /* ---- CLASS 13.1: settings and page elements ---- */
  var API_URLS = {
    local: 'drives.json',                                  // our own JSON file (same folder as this page)
    live: 'https://remotive.com/api/remote-jobs?category=software-dev&limit=15',   // public jobs API
    broken: 'missing-file.json'                            // does not exist: used to test errors
  };

  var TIMEOUT_MS = 6000;                                   // give up after 6 seconds
  var PAGE_SIZE = 6;                                       // rows on one page

  /* Sample data built into the page. It is used only when the student
     clicks "Use offline sample data" after the server fails. */
  var SAMPLE_DRIVES = [
    { company: 'TechNova Solutions', role: 'Software Developer', location: 'Coimbatore', package: 4.5, openings: 40, date: '2026-11-25', status: 'Upcoming' },
    { company: 'DataSphere Analytics', role: 'Data Analyst', location: 'Chennai', package: 6.0, openings: 25, date: '2026-11-28', status: 'Open' },
    { company: 'BuildWell Engineering', role: 'Graduate Engineer Trainee', location: 'Hosur', package: 3.8, openings: 60, date: '2026-12-02', status: 'Open' },
    { company: 'CloudNest Technologies', role: 'Cloud Support Engineer', location: 'Bengaluru', package: 7.2, openings: 15, date: '2026-12-05', status: 'Upcoming' },
    { company: 'FinEdge Systems', role: 'Web Developer', location: 'Chennai', package: 5.0, openings: 30, date: '2026-12-08', status: 'Upcoming' },
    { company: 'GreenVolt Energy', role: 'Electrical Engineer', location: 'Coimbatore', package: 4.2, openings: 20, date: '2026-11-20', status: 'Open' },
    { company: 'MediSoft Health', role: 'QA Engineer', location: 'Hyderabad', package: 4.8, openings: 18, date: '2026-11-12', status: 'Closed' },
    { company: 'AutoDrive Motors', role: 'Design Engineer', location: 'Pune', package: 5.5, openings: 12, date: '2026-11-05', status: 'Closed' },
    { company: 'InfraCore Networks', role: 'Network Engineer', location: 'Chennai', package: 4.0, openings: 22, date: '2026-12-10', status: 'Upcoming' },
    { company: 'PixelWorks Studio', role: 'UI Developer', location: 'Kochi', package: 4.6, openings: 10, date: '2026-11-22', status: 'Open' },
    { company: 'LogiTrack Pvt Ltd', role: 'Systems Analyst', location: 'Coimbatore', package: 3.6, openings: 35, date: '2026-12-14', status: 'Upcoming' },
    { company: 'EduSpark Learning', role: 'Technical Trainer', location: 'Madurai', package: 3.4, openings: 16, date: '2026-11-09', status: 'Closed' }
  ];

  var loader = document.getElementById('loader');
  var errorBox = document.getElementById('errorBox');
  var errorText = document.getElementById('errorText');
  var summary = document.getElementById('summary');
  var chartBox = document.getElementById('chartBox');
  var chart = document.getElementById('chart');
  var tableWrap = document.getElementById('tableWrap');
  var driveBody = document.getElementById('driveBody');
  var pager = document.getElementById('pager');
  var pageInfo = document.getElementById('pageInfo');
  var apiMeta = document.getElementById('apiMeta');
  var sourceSelect = document.getElementById('sourceSelect');
  var searchBox = document.getElementById('searchBox');
  var statusFilter = document.getElementById('statusFilter');

  var allDrives = [];                                      // data received from the API
  var lastSource = 'local';                                // used by "Try Again"
  var sortKey = '';                                        // column used for sorting
  var sortDir = 1;                                         // 1 = ascending, -1 = descending
  var currentPage = 1;

  /* ---- CLASS 13.2: fetch the JSON (with a time limit) ---- */
  // async functions can use await, which waits for a promise without freezing the page
  async function fetchJson(url) {
    var controller = new AbortController();               // lets us cancel a slow request
    var timer = setTimeout(function () { controller.abort(); }, TIMEOUT_MS);

    try {
      var response = await fetch(url, { signal: controller.signal });

      if (!response.ok) {                                  // 404, 500 etc. are not errors for fetch, so check
        throw new Error('Server returned ' + response.status + ' (' + (response.statusText || 'error') + ')');
      }

      return await response.json();                        // convert the text into a JavaScript object
    } finally {
      clearTimeout(timer);                                 // always stop the timer
    }
  }

  /* ---- CLASS 13.3: make both APIs look the same ---- */
  function normalize(source, data) {
    if (source === 'local') {
      return data.drives;
    }
    return data.jobs.map(function (job) {                  // public jobs API: rename the fields
      return {
        company: job.company_name,
        role: job.title,
        location: job.candidate_required_location || 'Remote',
        package: job.salary || 'Not disclosed',
        openings: '-',
        date: (job.publication_date || '').slice(0, 10),
        status: 'Open',
        url: job.url
      };
    });
  }

  /* ---- CLASS 13.4: load data (try / catch / finally) ---- */
  async function loadDrives(source) {
    lastSource = source;
    var started = performance.now();

    loader.classList.add('show');                          // show the spinner
    errorBox.classList.remove('show');
    tableWrap.classList.remove('show');
    chartBox.classList.remove('show');
    pager.classList.remove('show');
    summary.textContent = '';
    apiMeta.textContent = '';

    try {
      // small pause so the loading indicator can be seen on a fast computer
      await new Promise(function (resolve) { setTimeout(resolve, 900); });

      var data = await fetchJson(API_URLS[source]);
      allDrives = normalize(source, data);

      if (!allDrives || allDrives.length === 0) {
        throw new Error('The server sent an empty list');
      }

      currentPage = 1;
      showAll();

      var seconds = ((performance.now() - started) / 1000).toFixed(1);
      apiMeta.textContent = 'Source: ' + API_URLS[source] + '  |  ' + allDrives.length +
                            ' records  |  loaded in ' + seconds + ' s' +
                            (data.updated ? '  |  last updated ' + data.updated : '');
      showToast('Data loaded successfully', 'success');

    } catch (error) {
      var message;

      if (error.name === 'AbortError') {
        message = 'The server took longer than ' + (TIMEOUT_MS / 1000) + ' seconds to answer. Please try again.';
      } else if (error instanceof TypeError) {
        // fetch() throws a TypeError when the server cannot be reached at all
        message = 'Could not reach the server. Check your internet, or open this page with Live Server and keep drives.json in the same folder.';
      } else {
        message = 'Could not load data. ' + error.message + '.';
      }

      errorText.textContent = message;
      errorBox.classList.add('show');
      showToast('Failed to load data', 'error');

    } finally {
      loader.classList.remove('show');                     // always hide the spinner
    }
  }

  /* ---- CLASS 13.5: filter and sort the data ---- */
  function getRows() {
    var term = searchBox.value.trim().toLowerCase();
    var status = statusFilter.value;

    var rows = allDrives.filter(function (item) {
      var text = (item.company + ' ' + item.role + ' ' + item.location).toLowerCase();
      return text.indexOf(term) !== -1 && (status === 'all' || item.status === status);
    });

    if (sortKey) {
      rows.sort(function (a, b) {
        var x = a[sortKey], y = b[sortKey];
        if (typeof x === 'number' && typeof y === 'number') { return (x - y) * sortDir; }
        return String(x).localeCompare(String(y)) * sortDir;
      });
    }
    return rows;
  }

  /* draws everything that depends on the data */
  function showAll() {
    var rows = getRows();
    renderSummary(allDrives);
    renderChart(rows);
    renderTable(rows);
  }

  /* ---- CLASS 13.6: summary cards ---- */
  function addCard(value, label) {
    var card = document.createElement('div');
    card.className = 'summary-card';

    var big = document.createElement('strong');
    big.textContent = value;
    var small = document.createElement('span');
    small.textContent = label;

    card.appendChild(big);
    card.appendChild(small);
    summary.appendChild(card);
  }

  function renderSummary(list) {
    var open = 0, openings = 0, highest = 0;

    list.forEach(function (item) {
      if (item.status === 'Open') { open++; }
      if (typeof item.openings === 'number') { openings += item.openings; }
      var pay = parseFloat(item.package);
      if (!isNaN(pay) && pay > highest) { highest = pay; }
    });

    summary.textContent = '';                              // clear old cards
    addCard(list.length, 'Total drives');
    addCard(open, 'Open now');
    addCard(openings > 0 ? openings : 'N/A', 'Total openings');
    addCard(highest > 0 ? highest + ' LPA' : 'N/A', 'Highest package');
  }

  /* ---- CLASS 13.7: bar chart of packages ---- */
  function renderChart(rows) {
    var bars = rows.filter(function (item) { return typeof item.package === 'number'; })
                   .sort(function (a, b) { return b.package - a.package; })
                   .slice(0, 8);

    chart.textContent = '';

    if (bars.length === 0) {
      chartBox.classList.remove('show');                   // nothing numeric to draw
      return;
    }

    var max = bars[0].package;

    bars.forEach(function (item) {
      var row = document.createElement('div');
      row.className = 'bar-row';

      var label = document.createElement('span');
      label.className = 'bar-label';
      label.textContent = item.company;

      var track = document.createElement('div');
      track.className = 'bar-track';
      var fill = document.createElement('div');
      fill.className = 'bar-fill status-' + item.status.toLowerCase();
      track.appendChild(fill);

      var value = document.createElement('span');
      value.className = 'bar-value';
      value.textContent = item.package + ' LPA';

      row.appendChild(label);
      row.appendChild(track);
      row.appendChild(value);
      chart.appendChild(row);

      // set the width after the row is on the page so the bar grows smoothly
      setTimeout(function () { fill.style.width = (item.package / max * 100) + '%'; }, 50);
    });

    chartBox.classList.add('show');
  }

  /* ---- CLASS 13.8: table rows and pages ---- */
  function addCell(row, text, label) {
    var cell = document.createElement('td');
    cell.textContent = text;
    cell.setAttribute('data-label', label);                // used by the mobile card layout
    row.appendChild(cell);
    return cell;
  }

  function renderTable(rows) {
    var totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    if (currentPage > totalPages) { currentPage = totalPages; }

    var start = (currentPage - 1) * PAGE_SIZE;
    var pageRows = rows.slice(start, start + PAGE_SIZE);

    driveBody.textContent = '';                            // remove old rows

    if (rows.length === 0) {
      var emptyRow = document.createElement('tr');
      emptyRow.className = 'empty-row';
      var emptyCell = document.createElement('td');
      emptyCell.colSpan = 8;
      emptyCell.textContent = 'No drives match your search.';
      emptyRow.appendChild(emptyCell);
      driveBody.appendChild(emptyRow);
    }

    pageRows.forEach(function (item, index) {
      var row = document.createElement('tr');
      row.style.animationDelay = (index * 0.05) + 's';     // rows appear one after another

      addCell(row, item.company, 'Company');
      addCell(row, item.role, 'Role');
      addCell(row, item.location, 'Location');
      addCell(row, typeof item.package === 'number' ? item.package + ' LPA' : item.package, 'Package');
      addCell(row, item.openings, 'Openings');
      addCell(row, item.date, 'Date');

      var statusCell = addCell(row, '', 'Status');         // status badge
      var badge = document.createElement('span');
      badge.className = 'status-badge status-' + item.status.toLowerCase();
      badge.textContent = item.status;
      statusCell.appendChild(badge);

      var actionCell = addCell(row, '', 'Action');         // action button
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'row-btn';
      button.textContent = item.status === 'Closed' ? 'Closed' : (item.url ? 'View' : 'Apply');
      button.disabled = item.status === 'Closed';
      button.addEventListener('click', function () {
        if (item.url) {
          window.open(item.url, '_blank');
        } else {
          showToast('Application started for ' + item.company, 'success');
        }
      });
      actionCell.appendChild(button);

      driveBody.appendChild(row);
    });

    // page buttons
    pageInfo.textContent = rows.length === 0 ? '' :
      'Showing ' + (start + 1) + ' to ' + (start + pageRows.length) + ' of ' + rows.length +
      '  (page ' + currentPage + ' of ' + totalPages + ')';
    document.getElementById('prevBtn').disabled = currentPage <= 1;
    document.getElementById('nextBtn').disabled = currentPage >= totalPages;
    pager.classList.toggle('show', rows.length > PAGE_SIZE);

    tableWrap.classList.add('show');
  }

  /* ---- CLASS 13.9: sorting by clicking a heading ---- */
  var sortHeads = document.querySelectorAll('#driveTable th.sortable');

  sortHeads.forEach(function (th) {
    th.addEventListener('click', function () {
      if (!allDrives.length) { return; }

      var key = th.dataset.sort;
      sortDir = (sortKey === key) ? -sortDir : 1;          // same column: flip the direction
      sortKey = key;

      sortHeads.forEach(function (other) { other.classList.remove('asc', 'desc'); });
      th.classList.add(sortDir === 1 ? 'asc' : 'desc');

      currentPage = 1;
      showAll();
    });
  });

  /* ---- CLASS 13.10: export the shown rows as a CSV file ---- */
  document.getElementById('exportBtn').addEventListener('click', function () {
    if (!allDrives.length) {
      showToast('Load the data first', 'error');
      return;
    }

    var rows = getRows();
    var lines = ['Company,Role,Location,Package,Openings,Date,Status'];

    rows.forEach(function (item) {
      var cells = [item.company, item.role, item.location, item.package, item.openings, item.date, item.status];
      lines.push(cells.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(','));
    });

    var blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'placement-drives.csv';
    link.click();
    URL.revokeObjectURL(link.href);

    showToast(rows.length + ' rows exported', 'success');
  });

  /* ---- CLASS 13.11: buttons and filters ---- */
  document.getElementById('loadBtn').addEventListener('click', function () {
    loadDrives(sourceSelect.value);
  });

  document.getElementById('errorBtn').addEventListener('click', function () {
    loadDrives('broken');                                  // asks for a file that does not exist
  });

  document.getElementById('retryBtn').addEventListener('click', function () {
    loadDrives(lastSource === 'broken' ? sourceSelect.value : lastSource);
  });

  // when the server fails, the student can still see the demo with built-in data
  document.getElementById('offlineBtn').addEventListener('click', function () {
    allDrives = SAMPLE_DRIVES;
    errorBox.classList.remove('show');
    currentPage = 1;
    showAll();
    apiMeta.textContent = 'Source: offline sample data built into the page  |  ' + allDrives.length + ' records';
    showToast('Showing offline sample data', 'info');
  });

  sourceSelect.addEventListener('change', function () {
    loadDrives(sourceSelect.value);
  });

  [searchBox, statusFilter].forEach(function (control) {
    control.addEventListener(control === searchBox ? 'input' : 'change', function () {
      if (allDrives.length) { currentPage = 1; showAll(); }
    });
  });

  document.getElementById('prevBtn').addEventListener('click', function () {
    currentPage--;
    renderTable(getRows());
  });

  document.getElementById('nextBtn').addEventListener('click', function () {
    currentPage++;
    renderTable(getRows());
  });

  loadDrives('local');                                     // load the data when the page opens


  /* ==========================================================
     CLASS 14: Application tracker with localStorage (Practicum 13)
     A small CRUD app:
       Create  - push() a new object into an array
       Read    - JSON.parse(localStorage.getItem(...))
       Update  - find() the object, change it, save again
       Delete  - filter() the object out, remove() the row
     Every change is saved with
       localStorage.setItem(key, JSON.stringify(array))
     ========================================================== */

  /* ---- CLASS 14.1: saving and loading (localStorage) ---- */
  var APP_KEY = 'pp_applications';                         // key for the applications list
  var TASK_KEY = 'pp_tasks';                               // key for the checklist

  // localStorage only stores text, so arrays are converted with JSON.stringify / JSON.parse
  function readStore(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw === null ? null : JSON.parse(raw);
    } catch (error) {
      return null;                                         // damaged data or storage blocked
    }
  }

  function writeStore(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      showToast('Could not save data in this browser', 'error');
      return false;
    }
  }

  var applications = readStore(APP_KEY) || [];
  var tasks = readStore(TASK_KEY);

  if (tasks === null) {                                    // first visit: start with 3 tasks
    tasks = [
      { id: 1, text: 'Update resume', done: false },
      { id: 2, text: 'Practice aptitude questions', done: false },
      { id: 3, text: 'Prepare for mock interview', done: false }
    ];
    writeStore(TASK_KEY, tasks);
  }

  var STATUS_NAMES = {
    Applied: 'Applied',
    Shortlisted: 'Shortlisted',
    Interview: 'Interview Scheduled',
    Offer: 'Offer Received',
    Rejected: 'Rejected'
  };

  var appForm = document.getElementById('appForm');
  var appBody = document.getElementById('appBody');
  var emptyState = document.getElementById('emptyState');
  var saveInfo = document.getElementById('saveInfo');
  var statusStats = document.getElementById('statusStats');
  var trackSearch = document.getElementById('trackSearch');
  var trackFilter = document.getElementById('trackFilter');
  var apDate = document.getElementById('apDate');
  var editingId = null;                                    // id of the row being edited (null = adding)

  function today() {
    return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }

  apDate.value = today();

  function updateSaveInfo() {
    saveInfo.textContent = applications.length + ' application(s) saved in this browser  |  last saved ' +
                           new Date().toLocaleTimeString();
  }

  /* ---- CLASS 14.2: status counters (ul / li) ---- */
  function renderStats() {
    statusStats.textContent = '';

    var items = [['all', 'Total', applications.length]];
    Object.keys(STATUS_NAMES).forEach(function (key) {
      var count = applications.filter(function (a) { return a.status === key; }).length;   // filter()
      items.push([key, STATUS_NAMES[key], count]);
    });

    items.forEach(function (item) {
      var li = document.createElement('li');
      var number = document.createElement('strong');
      number.textContent = item[2];
      var label = document.createElement('span');
      label.textContent = item[1];

      li.appendChild(number);
      li.appendChild(label);
      statusStats.appendChild(li);
    });
  }

  /* ---- CLASS 14.3: build one table row ---- */
  function addTrackCell(row, text, label) {
    var cell = document.createElement('td');
    cell.textContent = text;
    cell.setAttribute('data-label', label);
    row.appendChild(cell);
    return cell;
  }

  function buildRow(app, isNew) {
    var row = document.createElement('tr');
    row.dataset.id = app.id;
    if (isNew) { row.classList.add('new-row'); }

    addTrackCell(row, app.company, 'Company');
    addTrackCell(row, app.role, 'Role');
    addTrackCell(row, app.date, 'Applied On');
    addTrackCell(row, app.package !== '' ? app.package + ' LPA' : '-', 'Package');

    // status drop-down: changing it updates the saved data immediately
    var statusCell = addTrackCell(row, '', 'Status');
    var select = document.createElement('select');
    select.className = 'status-select st-' + app.status;
    Object.keys(STATUS_NAMES).forEach(function (key) {
      var option = document.createElement('option');
      option.value = key;
      option.textContent = STATUS_NAMES[key];
      option.selected = (key === app.status);
      select.appendChild(option);
    });
    select.addEventListener('change', function () {
      var found = applications.find(function (a) { return a.id === app.id; });   // find()
      found.status = select.value;
      select.className = 'status-select st-' + found.status;
      writeStore(APP_KEY, applications);
      updateSaveInfo();
      renderStats();
      showToast('Status changed to ' + STATUS_NAMES[found.status], 'info');
    });
    statusCell.appendChild(select);

    var noteCell = addTrackCell(row, app.notes || '-', 'Notes');
    noteCell.className = 'note-cell';
    noteCell.title = app.notes;

    // edit and delete buttons
    var actionCell = addTrackCell(row, '', 'Actions');
    var box = document.createElement('div');
    box.className = 'row-actions';

    var editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'mini-btn';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', function () { startEdit(app.id); });

    var deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'mini-btn danger';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', function () { deleteApplication(app.id, row); });

    box.appendChild(editBtn);
    box.appendChild(deleteBtn);
    actionCell.appendChild(box);
    return row;
  }

  /* ---- CLASS 14.4: show the table (search + filter) ---- */
  function renderTracker(newId) {
    var term = trackSearch.value.trim().toLowerCase();
    var status = trackFilter.value;

    var rows = applications.filter(function (a) {          // filter()
      var text = (a.company + ' ' + a.role).toLowerCase();
      return text.indexOf(term) !== -1 && (status === 'all' || a.status === status);
    });

    rows.sort(function (a, b) {                            // newest date first
      return b.date.localeCompare(a.date) || b.id - a.id;
    });

    appBody.textContent = '';
    rows.forEach(function (app) {
      appBody.appendChild(buildRow(app, app.id === newId));
    });

    updateEmptyState();
    renderStats();
    updateSaveInfo();
  }

  function updateEmptyState() {
    var visible = appBody.children.length;
    emptyState.classList.toggle('show', visible === 0);
    emptyState.textContent = applications.length === 0
      ? 'No applications yet. Add your first one above, or click "Load Sample Data".'
      : 'No applications match your search.';
    document.querySelector('.tracker-table').style.display = visible === 0 ? 'none' : '';
  }

  /* ---- CLASS 14.5: add or update (form submit) ---- */
  function leaveEditMode() {
    editingId = null;
    appForm.classList.remove('edit-mode');
    document.getElementById('formTitle').textContent = 'Add an Application';
    document.getElementById('appSubmit').textContent = 'Add Application';
    appForm.reset();
    apDate.value = today();
  }

  appForm.addEventListener('submit', function (event) {
    event.preventDefault();

    var data = {
      company: document.getElementById('apCompany').value.trim(),
      role: document.getElementById('apRole').value.trim(),
      date: apDate.value,
      package: document.getElementById('apPackage').value,
      status: document.getElementById('apStatus').value,
      notes: document.getElementById('apNotes').value.trim()
    };

    if (data.company === '' || data.role === '') {
      showToast('Company and role cannot be empty', 'error');
      return;
    }

    var newId = null;

    if (editingId !== null) {
      // UPDATE: find the saved object and change its values
      var found = applications.find(function (a) { return a.id === editingId; });
      Object.assign(found, data);
      showToast('Application updated', 'success');
    } else {
      // CREATE: push a new object into the array
      newId = Date.now();
      data.id = newId;
      applications.push(data);
      showToast('Application added', 'success');
    }

    writeStore(APP_KEY, applications);                     // save in localStorage
    leaveEditMode();
    renderTracker(newId);
  });

  /* ---- CLASS 14.6: edit (copy the saved values back into the form) ---- */
  function startEdit(id) {
    var app = applications.find(function (a) { return a.id === id; });   // find()

    document.getElementById('apCompany').value = app.company;
    document.getElementById('apRole').value = app.role;
    apDate.value = app.date;
    document.getElementById('apPackage').value = app.package;
    document.getElementById('apStatus').value = app.status;
    document.getElementById('apNotes').value = app.notes;

    editingId = id;
    appForm.classList.add('edit-mode');
    document.getElementById('formTitle').textContent = 'Edit Application';
    document.getElementById('appSubmit').textContent = 'Update Application';
    appForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.getElementById('apCompany').focus({ preventScroll: true });
  }

  document.getElementById('appCancel').addEventListener('click', leaveEditMode);

  /* ---- CLASS 14.7: delete ---- */
  function deleteApplication(id, row) {
    row.classList.add('removing');                         // slide-away animation

    setTimeout(function () {
      applications = applications.filter(function (a) { return a.id !== id; });   // filter() keeps the others
      writeStore(APP_KEY, applications);
      row.remove();                                        // remove the row from the page

      if (editingId === id) { leaveEditMode(); }
      updateEmptyState();
      renderStats();
      updateSaveInfo();
      showToast('Application deleted', 'info');
    }, 300);
  }

  /* ---- CLASS 14.8: search, filter, sample data, clear all ---- */
  trackSearch.addEventListener('input', function () { renderTracker(); });
  trackFilter.addEventListener('change', function () { renderTracker(); });

  document.getElementById('sampleBtn').addEventListener('click', function () {
    var samples = [
      { company: 'TechNova Solutions', role: 'Software Developer', date: '2026-11-10', package: '4.5', status: 'Interview', notes: 'Technical round on 25 Nov. Revise arrays and SQL.' },
      { company: 'DataSphere Analytics', role: 'Data Analyst', date: '2026-11-12', package: '6', status: 'Shortlisted', notes: 'Online test link received.' },
      { company: 'BuildWell Engineering', role: 'Graduate Engineer Trainee', date: '2026-11-05', package: '3.8', status: 'Applied', notes: '' },
      { company: 'CloudNest Technologies', role: 'Cloud Support Engineer', date: '2026-10-28', package: '7.2', status: 'Offer', notes: 'Offer letter expected this week.' },
      { company: 'FinEdge Systems', role: 'Web Developer', date: '2026-10-20', package: '5', status: 'Rejected', notes: 'Improve DSA practice.' }
    ];

    var added = 0;
    samples.forEach(function (sample, index) {
      var exists = applications.find(function (a) { return a.company === sample.company && a.role === sample.role; });
      if (!exists) {
        sample.id = Date.now() + index;
        applications.push(sample);                         // push()
        added++;
      }
    });

    writeStore(APP_KEY, applications);
    renderTracker();
    showToast(added ? added + ' sample applications added' : 'Sample data is already added', added ? 'success' : 'info');
  });

  document.getElementById('clearBtn').addEventListener('click', function () {
    if (applications.length === 0) {
      showToast('Nothing to clear', 'info');
      return;
    }
    if (window.confirm('Delete all ' + applications.length + ' applications?')) {
      applications = [];
      writeStore(APP_KEY, applications);
      leaveEditMode();
      renderTracker();
      showToast('All applications deleted', 'info');
    }
  });

  /* ---- CLASS 14.9: preparation checklist (ul / li) ---- */
  var taskList = document.getElementById('taskList');
  var taskForm = document.getElementById('taskForm');
  var taskInput = document.getElementById('taskInput');
  var taskProgress = document.getElementById('taskProgress');

  function updateTaskProgress() {
    var done = tasks.filter(function (t) { return t.done; }).length;
    taskProgress.textContent = tasks.length === 0 ? 'No tasks yet.' : done + ' of ' + tasks.length + ' tasks done';
  }

  function buildTask(task) {
    var li = document.createElement('li');
    li.classList.toggle('done', task.done);

    var check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = task.done;
    check.setAttribute('aria-label', 'Mark task as done');
    check.addEventListener('change', function () {
      var found = tasks.find(function (t) { return t.id === task.id; });   // find()
      found.done = check.checked;
      li.classList.toggle('done', found.done);             // toggle the strike-through
      writeStore(TASK_KEY, tasks);
      updateTaskProgress();
    });

    var text = document.createElement('span');
    text.textContent = task.text;

    var del = document.createElement('button');
    del.type = 'button';
    del.className = 'del-btn';
    del.setAttribute('aria-label', 'Delete task');
    del.innerHTML = '&times;';
    del.addEventListener('click', function () {
      li.classList.add('removing');
      setTimeout(function () {
        tasks = tasks.filter(function (t) { return t.id !== task.id; });
        writeStore(TASK_KEY, tasks);
        li.remove();                                       // remove the list item
        updateTaskProgress();
      }, 300);
    });

    li.appendChild(check);
    li.appendChild(text);
    li.appendChild(del);
    return li;
  }

  tasks.forEach(function (task) {
    taskList.appendChild(buildTask(task));
  });

  taskForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var value = taskInput.value.trim();
    if (value === '') { return; }

    var task = { id: Date.now(), text: value, done: false };
    tasks.push(task);                                      // push()
    writeStore(TASK_KEY, tasks);
    taskList.appendChild(buildTask(task));
    updateTaskProgress();
    taskForm.reset();
  });

  /* show everything saved from the last visit */
  updateTaskProgress();
  renderTracker();


  /* ==========================================================
     CLASS 15: Navigation "More" menu (Practicum 14)
     ========================================================== */
  var moreBtn = document.getElementById('moreBtn');
  var moreMenu = document.getElementById('moreMenu');

  moreBtn.addEventListener('click', function (event) {
    event.stopPropagation();                                 // do not trigger the outside-click below
    var isOpen = moreMenu.classList.toggle('open');          // open if closed, close if open
    moreBtn.setAttribute('aria-expanded', isOpen);
  });

  // clicking anywhere else, or choosing a link, closes the menu
  document.addEventListener('click', function () {
    moreMenu.classList.remove('open');
    moreBtn.setAttribute('aria-expanded', 'false');
  });

  /* ==========================================================
     CLASS 16: Job Explorer (Practicum 14)
     - querySelector / querySelectorAll find the page elements
     - filter() chooses the cards that match the search
     - forEach() shows, hides and sorts the cards
     - find() looks up one job by its id
     - classList.add / remove / toggle change the look
     ========================================================== */

  /* ---- CLASS 16.1: page elements ---- */
  var jxGrid = document.querySelector('#jxGrid');
  var jxCards = document.querySelectorAll('.job-card');       // every job card
  var jxChips = document.querySelectorAll('#jxChips .chip');  // category buttons
  var jxSearch = document.querySelector('#jxSearch');
  var jxDept = document.querySelector('#jxDept');
  var jxSort = document.querySelector('#jxSort');
  var jxCount = document.querySelector('#jxCount');
  var jxEmpty = document.querySelector('#jxEmpty');

  var activeCategory = 'all';                                 // selected chip
  var SAVED_KEY = 'pp_saved_jobs';
  var savedIds = readStore(SAVED_KEY) || [];                  // ids of the saved jobs

  /* Finds one card using its id (find() returns the first match) */
  function getCard(id) {
    return Array.from(jxCards).find(function (card) {
      return card.dataset.id === String(id);
    });
  }

  /* text used by the search box: company, role and skills */
  jxCards.forEach(function (card) {
    var skills = Array.from(card.querySelectorAll('.skill-tags li')).map(function (li) { return li.textContent; });
    card.dataset.search = (card.dataset.company + ' ' + card.dataset.role + ' ' + skills.join(' ')).toLowerCase();
  });

  /* ---- CLASS 16.2: filter, sort and show ---- */
  function applyFilters() {
    var term = jxSearch.value.trim().toLowerCase();
    var dept = jxDept.value;

    // filter() keeps only the cards that pass all three tests
    var matching = Array.from(jxCards).filter(function (card) {
      var okText = card.dataset.search.indexOf(term) !== -1;
      var okCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
      var okDept = dept === 'all' || card.dataset.dept.split(' ').indexOf(dept) !== -1;
      return okText && okCategory && okDept;
    });

    // hide everything, then show only the matching cards
    jxCards.forEach(function (card) { card.classList.add('hidden'); });
    matching.forEach(function (card) { card.classList.remove('hidden'); });

    // sort the cards and put them back into the grid in the new order
    var sorted = Array.from(jxCards).sort(function (a, b) {
      if (jxSort.value === 'high') { return b.dataset.package - a.dataset.package; }
      if (jxSort.value === 'low')  { return a.dataset.package - b.dataset.package; }
      if (jxSort.value === 'az')   { return a.dataset.company.localeCompare(b.dataset.company); }
      return a.dataset.id - b.dataset.id;
    });
    sorted.forEach(function (card, index) {
      card.style.animationDelay = (index * 0.04) + 's';
      jxGrid.appendChild(card);
    });

    jxCount.textContent = 'Showing ' + matching.length + ' of ' + jxCards.length + ' jobs';
    jxEmpty.classList.toggle('show', matching.length === 0);
  }

  /* ---- CLASS 16.3: search, select and chips ---- */
  jxSearch.addEventListener('input', applyFilters);
  jxDept.addEventListener('change', applyFilters);
  jxSort.addEventListener('change', applyFilters);

  jxChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      jxChips.forEach(function (other) { other.classList.remove('active'); });
      chip.classList.add('active');
      activeCategory = chip.dataset.cat;
      applyFilters();
    });
  });

  document.querySelector('#jxReset').addEventListener('click', function () {
    jxSearch.value = '';
    jxDept.value = 'all';
    jxSort.value = 'default';
    activeCategory = 'all';
    jxChips.forEach(function (chip) {
      chip.classList.toggle('active', chip.dataset.cat === 'all');
    });
    applyFilters();
  });

  /* ---- CLASS 16.4: details / summary (only one open at a time) ---- */
  var jxDetails = document.querySelectorAll('.job-details');

  jxDetails.forEach(function (item) {
    item.addEventListener('toggle', function () {            // runs when a <details> opens or closes
      if (item.open) {
        jxDetails.forEach(function (other) {
          if (other !== item) { other.removeAttribute('open'); }
        });
      }
    });
  });

  /* ---- CLASS 16.5: saved jobs (heart button + drawer) ---- */
  var jxDrawer = document.querySelector('#jxDrawer');
  var jxBackdrop = document.querySelector('#jxBackdrop');
  var jxSavedList = document.querySelector('#jxSavedList');
  var jxSavedEmpty = document.querySelector('#jxSavedEmpty');
  var jxSavedCount = document.querySelector('#jxSavedCount');

  function refreshSaved() {
    // heart buttons
    jxCards.forEach(function (card) {
      var isSaved = savedIds.indexOf(card.dataset.id) !== -1;
      var heart = card.querySelector('.save-btn');
      heart.classList.toggle('saved', isSaved);
      heart.setAttribute('aria-pressed', isSaved);
      heart.innerHTML = isSaved ? '&#9829;' : '&#9825;';
    });

    // drawer list
    jxSavedList.textContent = '';
    savedIds.forEach(function (id) {
      var card = getCard(id);                                // find()
      if (!card) { return; }                                 // ignore an unknown id
      var li = document.createElement('li');

      var img = document.createElement('img');
      img.src = card.querySelector('img').src;
      img.alt = '';

      var text = document.createElement('div');
      text.className = 'saved-text';
      var title = document.createElement('strong');
      title.textContent = card.dataset.role;
      var company = document.createElement('span');
      company.textContent = card.dataset.company + ' | ' + card.dataset.package + ' LPA';
      text.appendChild(title);
      text.appendChild(company);

      var del = document.createElement('button');
      del.type = 'button';
      del.className = 'del-btn';
      del.setAttribute('aria-label', 'Remove from saved');
      del.innerHTML = '&times;';
      del.addEventListener('click', function () { toggleSaved(id); });

      li.appendChild(img);
      li.appendChild(text);
      li.appendChild(del);
      jxSavedList.appendChild(li);
    });

    jxSavedCount.textContent = savedIds.length;
    jxSavedEmpty.style.display = savedIds.length === 0 ? 'block' : 'none';
    document.querySelector('#jxModalSave').textContent = 'Save Job';
  }

  function toggleSaved(id) {
    id = String(id);
    if (savedIds.indexOf(id) === -1) {
      savedIds.push(id);                                     // save it
      showToast('Job saved', 'success');
    } else {
      savedIds = savedIds.filter(function (item) { return item !== id; });   // remove it
      showToast('Job removed from saved', 'info');
    }
    writeStore(SAVED_KEY, savedIds);
    refreshSaved();
    updateModalSave();
  }

  jxCards.forEach(function (card) {
    card.querySelector('.save-btn').addEventListener('click', function () {
      toggleSaved(card.dataset.id);
    });
  });

  function openDrawer() {
    jxDrawer.classList.add('open');
    jxBackdrop.classList.add('show');
    jxDrawer.setAttribute('aria-hidden', 'false');
  }

  function closeDrawer() {
    jxDrawer.classList.remove('open');
    jxBackdrop.classList.remove('show');
    jxDrawer.setAttribute('aria-hidden', 'true');
  }

  document.querySelector('#jxSaved').addEventListener('click', openDrawer);
  document.querySelector('#jxDrawerClose').addEventListener('click', closeDrawer);
  jxBackdrop.addEventListener('click', closeDrawer);

  /* ---- CLASS 16.6: quick view popup ---- */
  var jxModal = document.querySelector('#jxModal');
  var modalId = null;                                        // id of the job shown in the popup

  function updateModalSave() {
    var saved = savedIds.indexOf(String(modalId)) !== -1;
    document.querySelector('#jxModalSave').textContent = saved ? 'Remove from Saved' : 'Save Job';
  }

  function addPill(list, text) {
    var li = document.createElement('li');
    li.textContent = text;
    list.appendChild(li);
  }

  function openModal(id) {
    var card = getCard(id);                                  // find() the card
    modalId = card.dataset.id;

    var img = document.querySelector('#jxModalImg');
    img.src = card.querySelector('img').src;
    img.alt = card.dataset.company + ' logo';

    document.querySelector('#jxModalTitle').textContent = card.dataset.role;
    document.querySelector('#jxModalCompany').textContent = card.dataset.company;
    document.querySelector('#jxModalInfo').textContent = card.dataset.info;

    var meta = document.querySelector('#jxModalMeta');
    meta.textContent = '';
    addPill(meta, card.dataset.location);
    addPill(meta, card.dataset.package + ' LPA');
    addPill(meta, card.dataset.mode);

    var skills = document.querySelector('#jxModalSkills');
    skills.textContent = '';
    card.querySelectorAll('.skill-tags li').forEach(function (li) {
      addPill(skills, li.textContent);
    });

    updateModalSave();
    jxModal.classList.add('open');
    document.body.classList.add('no-scroll');
    document.querySelector('#jxModalClose').focus();
  }

  function closeModal() {
    jxModal.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  jxCards.forEach(function (card) {
    card.querySelector('.view-btn').addEventListener('click', function () {
      openModal(card.dataset.id);
    });
  });

  document.querySelector('#jxModalClose').addEventListener('click', closeModal);

  jxModal.addEventListener('click', function (event) {
    if (event.target === jxModal) { closeModal(); }          // click on the dark background
  });

  document.querySelector('#jxModalSave').addEventListener('click', function () {
    toggleSaved(modalId);
  });

  // "Apply Now" also adds the job to the Application Tracker (Practicum 13)
  document.querySelector('#jxModalApply').addEventListener('click', function () {
    var card = getCard(modalId);
    var already = applications.find(function (a) {
      return a.company === card.dataset.company && a.role === card.dataset.role;
    });

    if (already) {
      showToast('You have already applied to this job', 'info');
    } else {
      applications.push({
        id: Date.now(),
        company: card.dataset.company,
        role: card.dataset.role,
        date: today(),
        package: card.dataset.package,
        status: 'Applied',
        notes: 'Applied from Job Explorer'
      });
      writeStore(APP_KEY, applications);
      renderTracker();
      showToast('Applied! Added to your tracker', 'success');
    }
    closeModal();
  });

  // Esc key closes the popup and the drawer
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeModal();
      closeDrawer();
      moreMenu.classList.remove('open');
    }
  });

  /* ---- CLASS 16.7: first draw ---- */
  refreshSaved();
  applyFilters();


  /* ==========================================================
     CLASS 17: Portal settings with toggle switches (Practicum 15)
     - every switch is an <input type="checkbox">
     - its .checked value is read when the student clicks it
     - classList.toggle() adds or removes a class on <html>
       and the CSS (section 25) changes the page
     - the choices are saved with localStorage.setItem()
       and restored with localStorage.getItem()
     ========================================================== */

  /* ---- CLASS 17.1: the list of settings ----
     key      : name used inside localStorage
     cls      : class added to <html>
     whenOn   : true  = add the class when the switch is ON
                false = add the class when the switch is OFF
     start    : default position of the switch                */
  var SETTINGS_KEY = 'pp_settings';
  var root = document.documentElement;

  var SETTING_LIST = [
    { key: 'dark',       cls: 'dark-mode',     whenOn: true,  start: false, name: 'Dark mode' },
    { key: 'alerts',     cls: 'no-alerts',     whenOn: false, start: true,  name: 'Drive alerts' },
    { key: 'packages',   cls: 'hide-packages', whenOn: true,  start: false, name: 'Hide package amounts' },
    { key: 'compact',    cls: 'compact',       whenOn: true,  start: false, name: 'Compact view' },
    { key: 'animations', cls: 'no-animations', whenOn: false, start: true,  name: 'Animations' },
    { key: 'applyTab',   cls: 'no-apply-tab',  whenOn: false, start: true,  name: 'Quick Apply tab' }
  ];

  var settingToggles = document.querySelectorAll('input[data-setting]');
  var settingsSummary = document.querySelector('#settingsSummary');

  /* ---- CLASS 17.2: read the saved choices ---- */
  function loadSettings() {
    try {
      var text = localStorage.getItem(SETTINGS_KEY);          // text or null
      return text ? JSON.parse(text) : {};                    // text -> object
    } catch (error) {
      return {};                                              // damaged data or storage blocked
    }
  }

  function saveSettings(values) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(values));   // object -> text
    } catch (error) {
      showToast('Could not save the settings in this browser', 'error');
    }
  }

  var settingValues = loadSettings();

  function findSetting(key) {
    return SETTING_LIST.find(function (item) { return item.key === key; });
  }

  /* ---- CLASS 17.3: apply one setting to the page ---- */
  function applySetting(key, checked, fromUser) {
    var setting = findSetting(key);

    // classList.toggle(name, true) adds the class, toggle(name, false) removes it
    root.classList.toggle(setting.cls, checked === setting.whenOn);

    var label = document.querySelector('#state-' + key);      // the "On" / "Off" text
    label.textContent = checked ? 'On' : 'Off';
    label.classList.toggle('on', checked);

    // extra behaviour for some settings
    var driveAlert = document.querySelector('.drive-alert');
    if (key === 'alerts' && driveAlert && fromUser) {
      driveAlert.classList.toggle('show', checked);           // slide the alert in or out
    }
  }

  function updateSummary() {
    var on = Array.from(settingToggles).filter(function (toggle) { return toggle.checked; }).length;
    settingsSummary.textContent = on + ' of ' + settingToggles.length + ' switches are on';
  }

  /* ---- CLASS 17.4: put every switch in its saved position ---- */
  settingToggles.forEach(function (toggle) {
    var key = toggle.dataset.setting;
    var setting = findSetting(key);

    // use the saved value if there is one, otherwise the default
    toggle.checked = (typeof settingValues[key] === 'boolean') ? settingValues[key] : setting.start;
    applySetting(key, toggle.checked);

    // when the student clicks the switch
    toggle.addEventListener('change', function () {
      settingValues[key] = toggle.checked;                    // remember the new position
      saveSettings(settingValues);
      applySetting(key, toggle.checked, true);
      updateSummary();

      showToast(setting.name + (toggle.checked ? ' turned on' : ' turned off'), toggle.checked ? 'success' : 'info');
    });
  });

  updateSummary();

  /* ---- CLASS 17.5: reset button ---- */
  document.querySelector('#settingsReset').addEventListener('click', function () {
    settingToggles.forEach(function (toggle) {
      var key = toggle.dataset.setting;
      toggle.checked = findSetting(key).start;                // back to the default position
      settingValues[key] = toggle.checked;
      applySetting(key, toggle.checked, true);
    });

    saveSettings(settingValues);
    updateSummary();
    showToast('All settings reset to default', 'info');
  });

});