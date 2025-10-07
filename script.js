/* script.js
   All JS logic for Exercises 1 - 10.
   Each exercise section is labeled and commented.
*/

/* ------------------------------
   Exercise 1 — Change Text Content
   Objective: when button clicked, toggle paragraph text between "Hello" and "Goodbye"
   ------------------------------ */
(function exercise1() {
  const p = document.getElementById('myText');
  const btn = document.getElementById('changeBtn');

  btn.addEventListener('click', () => {
    // Toggle between "Hello" and "Goodbye"
    p.textContent = p.textContent.trim() === 'Hello' ? 'Goodbye' : 'Hello';
  });
})();

/* ------------------------------
   Exercise 2 — Modify CSS Styles Dynamically
   - Click the box to cycle through styles (background color, font size).
   - Bonus: toggle animation class to see transitions.
   ------------------------------ */
(function exercise2() {
  const box = document.getElementById('styleBox');
  const animateToggle = document.getElementById('animateToggle');

  // Style states to cycle through
  const states = [
    { background: '#fff3cd', fontSize: '16px', transform: 'scale(1)' },
    { background: '#d1e7dd', fontSize: '18px', transform: 'scale(1.02)' },
    { background: '#f8d7da', fontSize: '20px', transform: 'scale(1.03)' }
  ];
  let idx = 0;

  box.addEventListener('click', () => {
    idx = (idx + 1) % states.length;
    const s = states[idx];
    // Direct inline style updates
    box.style.background = s.background;
    box.style.fontSize = s.fontSize;
    box.style.transform = s.transform;
  });

  // Toggle CSS transition by adding/removing a class with transition rules
  animateToggle.addEventListener('change', (e) => {
    if (e.target.checked) box.classList.add('animated');
    else box.classList.remove('animated');
  });
})();

/* ------------------------------
   Exercise 3 — Add and Remove Classes
   - Toggle .highlight on first item via button.
   - Bonus: clicking any item highlights it and removes highlight from the others.
   ------------------------------ */
(function exercise3() {
  const container = document.getElementById('highlightItems');
  const btn = document.getElementById('toggleClassBtn');

  btn.addEventListener('click', () => {
    const first = container.querySelector('.item');
    if (first) first.classList.toggle('highlight');
  });

  // Delegate clicks to highlight only the clicked item (remove from siblings)
  container.addEventListener('click', (ev) => {
    const clicked = ev.target.closest('.item');
    if (!clicked) return;
    // Remove highlight from all items
    container.querySelectorAll('.item').forEach(i => i.classList.remove('highlight'));
    // Add to clicked
    clicked.classList.add('highlight');
  });
})();

/* ------------------------------
   Exercise 4 — Create and Append Elements
   - Add items to a UL with remove button for each new item.
   ------------------------------ */
(function exercise4() {
  const input = document.getElementById('newItemText');
  const btn = document.getElementById('addItemBtn');
  const list = document.getElementById('myList');

  btn.addEventListener('click', () => {
    const text = (input.value || '').trim();
    if (!text) {
      input.focus();
      return;
    }
    const li = document.createElement('li');
    li.textContent = text + ' ';
    // Remove button
    const rbtn = document.createElement('button');
    rbtn.textContent = 'Remove';
    rbtn.className = 'remove-created';
    rbtn.addEventListener('click', () => li.remove());
    li.appendChild(rbtn);
    list.appendChild(li);
    input.value = '';
    input.focus();
  });
})();

/* ------------------------------
   Exercise 5 — Remove Elements from the DOM
   - Delete buttons on each list item, optional confirmation
   ------------------------------ */
(function exercise5() {
  const list = document.getElementById('removableList');
  const confirmCheckbox = document.getElementById('confirmDelete');

  // Use event delegation to catch clicks on any delete button
  list.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.del-btn');
    if (!btn) return;
    const li = btn.closest('li');
    if (!li) return;
    if (confirmCheckbox.checked) {
      const ok = confirm('Are you sure you want to delete this item?');
      if (!ok) return;
    }
    li.remove(); // remove from DOM
  });
})();

/* ------------------------------
   Exercise 6 — Handling Events
   - Mouse and keyboard events, display last key pressed.
   - Bonus: drawing area that places dots while mouse is held down and moved.
   ------------------------------ */
(function exercise6() {
  const eventArea = document.getElementById('eventArea');
  const lastKeySpan = document.getElementById('lastKey');
  const dotsContainer = document.getElementById('dotsContainer');

  // Mouseover example
  eventArea.addEventListener('mouseover', () => (eventArea.style.borderColor = '#1e90ff'));
  eventArea.addEventListener('mouseout', () => (eventArea.style.borderColor = ''));

  // Keydown on the whole document
  document.addEventListener('keydown', (ev) => {
    lastKeySpan.textContent = `${ev.key} (code: ${ev.code})`;
  });

  // Drawing area:
  let drawing = false;
  dotsContainer.addEventListener('mousedown', (e) => {
    drawing = true;
    placeDot(e);
  });
  document.addEventListener('mouseup', () => (drawing = false));
  dotsContainer.addEventListener('mousemove', (e) => {
    if (drawing) placeDot(e);
  });

  function placeDot(event) {
    const rect = dotsContainer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const dot = document.createElement('div');
    dot.style.position = 'absolute';
    dot.style.left = `${x - 4}px`;
    dot.style.top = `${y - 4}px`;
    dot.style.width = '8px';
    dot.style.height = '8px';
    dot.style.borderRadius = '50%';
    dot.style.background = '#1e90ff';
    dot.style.opacity = '0.9';
    dot.style.pointerEvents = 'none';
    dotsContainer.appendChild(dot);
    // Remove dot after a while to avoid memory growth
    setTimeout(() => dot.remove(), 4000);
  }
})();

/* ------------------------------
   Exercise 7 — DOM Traversal
   - Click the child node to highlight parent, siblings and show ancestor chain.
   ------------------------------ */
(function exercise7() {
  const leaf = document.querySelector('#traversalTree .leaf');
  const output = document.getElementById('ancestorsOutput');

  leaf.addEventListener('click', (ev) => {
    ev.stopPropagation();

    // Highlight parent
    const parent = leaf.parentElement.closest('.node');
    // Remove previous highlights
    document.querySelectorAll('#traversalTree .node').forEach(n => n.style.boxShadow = '');

    if (parent) parent.style.boxShadow = '0 6px 18px rgba(30,144,255,0.14)';

    // Highlight siblings of the parent (if any)
    const siblings = Array.from(parent ? parent.parentElement.children : []);
    siblings.forEach(s => {
      s.style.borderLeft = '3px solid #ddd';
    });

    // Show all ancestors chain
    const ancestors = [];
    let cur = leaf;
    while (cur) {
      if (cur.classList && cur.classList.contains('node')) ancestors.push(cur);
      cur = cur.parentElement;
    }
    output.textContent = 'Ancestors: ' + ancestors.map(a => a.firstChild && a.firstChild.textContent.trim().split('\n')[0]).join(' > ');
  });

  // Bonus: click any ancestor to highlight all ancestors up to root
  document.getElementById('traversalTree').addEventListener('click', (ev) => {
    const node = ev.target.closest('.node');
    if (!node) return;
    // remove existing highlight styles
    document.querySelectorAll('#traversalTree .node').forEach(n => {
      n.style.background = '';
    });
    // highlight chain up to root
    let cur = node;
    while (cur) {
      if (cur.classList && cur.classList.contains('node')) {
        cur.style.background = '#fff7e6';
      }
      cur = cur.parentElement;
    }
  });
})();

/* ------------------------------
   Exercise 8 — Form Handling
   - Capture input values, prevent page reload, display validation errors inline.
   ------------------------------ */
(function exercise8() {
  const form = document.getElementById('sampleForm');
  const output = document.getElementById('formOutput');

  form.addEventListener('submit', (ev) => {
    ev.preventDefault(); // prevent reload
    const data = new FormData(form);
    const name = (data.get('name') || '').trim();
    const age = data.get('age');

    // Simple validation
    const errors = [];
    if (!name) errors.push('Name is required.');
    if (!age || Number(age) < 0) errors.push('Age must be a non-negative number.');

    if (errors.length) {
      output.innerHTML = `<strong style="color:#b00020">Errors:</strong><ul>${errors.map(e => `<li>${e}</li>`).join('')}</ul>`;
      return;
    }

    // Display values without reloading the page
    output.innerHTML = `<strong>Submitted:</strong>
                        <div>Name: ${escapeHtml(name)}</div>
                        <div>Age: ${escapeHtml(age)}</div>`;
    form.reset();
  });

  // simple html escape to reduce injection risk in this demo
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
})();

/* ------------------------------
   Exercise 9 — Fetch and Display Data
   - Fetch JSON data from a free placeholder API and render list items.
   - Bonus: add a client-side search filter.
   ------------------------------ */
(function exercise9() {
  const loadBtn = document.getElementById('loadUsersBtn');
  const usersList = document.getElementById('usersList');
  const filterInput = document.getElementById('filterInput');

  let usersCache = [];

  loadBtn.addEventListener('click', () => {
    loadBtn.disabled = true;
    loadBtn.textContent = 'Loading…';
    // Fetch from JSONPlaceholder (public demo API)
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(resp => {
        if (!resp.ok) throw new Error('Network response not ok');
        return resp.json();
      })
      .then(users => {
        usersCache = users;
        renderUsers(users);
      })
      .catch(err => {
        usersList.innerHTML = `<li style="color:#b00020">Failed to load users: ${err.message}</li>`;
      })
      .finally(() => {
        loadBtn.disabled = false;
        loadBtn.textContent = 'Load users (from JSONPlaceholder)';
      });
  });

  function renderUsers(users) {
    usersList.innerHTML = '';
    if (!users || users.length === 0) {
      usersList.innerHTML = '<li>No users</li>';
      return;
    }
    users.forEach(u => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${u.name}</strong> — ${u.email} <span style="color:var(--muted)">(${u.company && u.company.name})</span>`;
      usersList.appendChild(li);
    });
  }

  // Filter input (client-side)
  filterInput.addEventListener('input', (ev) => {
    const q = (ev.target.value || '').toLowerCase();
    const filtered = usersCache.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    renderUsers(filtered);
  });
})();

/* ------------------------------
   Exercise 10 — Simple Animations
   - Animate a bouncing ball using requestAnimationFrame.
   - Controls to start/stop, uses basic physics (velocity, gravity).
   ------------------------------ */
(function exercise10() {
  const ball = document.getElementById('ball');
  const area = document.querySelector('.animation-area');
  const startBtn = document.getElementById('startBounce');
  const stopBtn = document.getElementById('stopBounce');

  let rafId = null;
  // physics
  let x = 20;
  let y = 10;
  let vx = 2.5;
  let vy = 2;
  const gravity = 0.25;
  const damping = 0.75;

  // determine bounds
  function bounds() {
    return {
      width: area.clientWidth,
      height: area.clientHeight
    };
  }

  function step() {
    const b = bounds();
    vy += gravity;
    x += vx;
    y += vy;

    const ballW = ball.offsetWidth;
    const ballH = ball.offsetHeight;

    // collision with ground
    if (y + ballH > b.height) {
      y = b.height - ballH;
      vy = -vy * damping;
      // small threshold to stop tiny bounces
      if (Math.abs(vy) < 0.6) vy = 0;
    }
    // collision with ceiling
    if (y < 0) {
      y = 0;
      vy = -vy * damping;
    }
    // left/right walls
    if (x + ballW > b.width) {
      x = b.width - ballW;
      vx = -vx;
    }
    if (x < 0) {
      x = 0;
      vx = -vx;
    }

    ball.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;

    rafId = requestAnimationFrame(step);
  }

  startBtn.addEventListener('click', () => {
    if (rafId) return; // already running
    // reset some parameters for visible effect
    x = 20; y = 10; vx = 3.7; vy = 0;
    rafId = requestAnimationFrame(step);
  });

  stopBtn.addEventListener('click', () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  });

  // Stop animation when window is hidden to save CPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  });
})();
