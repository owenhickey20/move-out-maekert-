// ============================================================
// app.js — what your site DOES.
// Plain JavaScript, no libraries, no installs.
// It uses STARTUP and LISTINGS from data.js (loaded first).
// ============================================================

(function () {
  "use strict";

  // ----------------------------------------------------------
  // 1. Saving things in the browser (localStorage).
  //    This only remembers things on THIS browser on THIS device.
  //    Your teammates and your customers will NOT see it.
  //    A real product would need a server and a database for that.
  // ----------------------------------------------------------
  const storage = {
    get: function (key, fallback) {
      try {
        const saved = localStorage.getItem(key);
        return saved === null ? fallback : JSON.parse(saved);
      } catch (error) {
        return fallback; // storage blocked or broken: just carry on
      }
    },
    set: function (key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        return false;
      }
    }
  };

  let savedIds = storage.get("savedIds", []);
  let conversations = storage.get("marketMessages", {});
  let activeConversationId = null;
  let customListings = storage.get("customListings", []);
  customListings.forEach(function (item) {
    item.seller = item.seller || "Student seller";
    item.image = item.image || "assets/desk.svg";
    item.condition = Number(item.condition) || 3;
    if (!LISTINGS.some(function (listing) { return listing.id === item.id; })) {
      LISTINGS.unshift(item);
    }
  });

  // ----------------------------------------------------------
  // 2. Put the startup's name and pitch on the page.
  // ----------------------------------------------------------
  document.title = STARTUP.name;
  document.getElementById("brand-name").textContent = STARTUP.name;
  document.getElementById("tagline").textContent = STARTUP.tagline;
  document.getElementById("pitch").textContent = STARTUP.pitch;

  // ----------------------------------------------------------
  // 3. Views: show one section at a time, based on the #link in the address bar.
  // ----------------------------------------------------------
  function showView() {
    const requested = (window.location.hash || "#home").slice(1);
    const views = document.querySelectorAll("[data-view]");
    const exists = Array.prototype.some.call(views, function (view) {
      return view.id === requested;
    });
    const current = exists ? requested : "home";

    views.forEach(function (view) {
      view.hidden = view.id !== current;
    });

    document.querySelectorAll("nav a").forEach(function (link) {
      if (link.getAttribute("href") === "#" + current) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", showView);

  // ----------------------------------------------------------
  // Account prototype: sign-up details stay in this browser.
  // ----------------------------------------------------------
  const accountButton = document.getElementById("account-button");
  const accountDialog = document.getElementById("account-dialog");
  const accountForm = document.getElementById("account-form");
  const accountStatus = document.getElementById("account-status");
  const dialogClose = document.getElementById("dialog-close");

  function updateAccountButton() {
    const account = storage.get("marketAccount", null);
    accountButton.textContent = account ? "Hi, " + account.name.split(/\s+/)[0] : "Sign up";
  }

  accountButton.addEventListener("click", function () {
    accountStatus.textContent = "";
    accountDialog.showModal();
  });

  dialogClose.addEventListener("click", function () {
    accountDialog.close();
  });

  accountDialog.addEventListener("click", function (event) {
    if (event.target === accountDialog) accountDialog.close();
  });

  accountForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(accountForm);
    const account = {
      name: formData.get("name").trim(),
      email: formData.get("email").trim()
    };
    if (!account.name || !account.email) return;

    if (!storage.set("marketAccount", account)) {
      accountStatus.textContent = "Could not create the account in this browser. Check your storage settings and try again.";
      return;
    }

    updateAccountButton();
    accountStatus.textContent = "Account created for " + account.email + ".";
    accountForm.reset();
  });

  // ----------------------------------------------------------
  // 4. Explore page: build one card per listing.
  //    We use textContent (not innerHTML) so text is always shown
  //    as text — a basic security habit.
  // ----------------------------------------------------------
  const grid = document.getElementById("listing-grid");
  const searchBox = document.getElementById("search-box");
  const emptyMessage = document.getElementById("empty-message");
  const savedCount = document.getElementById("saved-count");
  const categoryFilter = document.getElementById("category-filter");
  const priceFilter = document.getElementById("price-filter");
  const filterButton = document.getElementById("filter-button");
  const filterPanel = document.getElementById("filter-panel");
  const activeFilterCount = document.getElementById("active-filter-count");
  const clearFilters = document.getElementById("clear-filters");

  function formatMoney(amount) {
    return "$" + Number(amount).toFixed(2).replace(".00", "");
  }

  function formatDeadline(dateString) {
    const date = new Date(dateString + "T12:00:00");
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  function makeConditionRating(condition) {
    const rating = document.createElement("p");
    const stars = Math.max(1, Math.min(5, Number(condition) || 3));
    rating.className = "condition-rating-display";
    rating.setAttribute("aria-label", stars + " out of 5 stars condition");
    rating.textContent = "Condition: " + "★".repeat(stars) + "☆".repeat(5 - stars);
    return rating;
  }

  function makeCard(item) {
    const card = document.createElement("article");
    card.className = "card listing-card";

    const image = document.createElement("img");
    image.className = "item-photo";
    image.src = item.image;
    image.alt = "Photo of " + item.name;
    image.loading = "lazy";

    const details = document.createElement("div");
    details.className = "listing-details";
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = item.category;

    const title = document.createElement("h2");
    title.textContent = item.name;

    const text = document.createElement("p");
    text.textContent = item.description;

    const price = document.createElement("p");
    price.className = "listing-price";
    price.textContent = formatMoney(item.price);

    const fee = Number(item.price) * 0.05;
    const feeText = document.createElement("p");
    feeText.className = "fee-detail";
    feeText.textContent = "Seller receives " + formatMoney(Number(item.price) - fee) +
      " · 5% fee (" + formatMoney(fee) + ")";

    const deadline = document.createElement("p");
    deadline.className = "deadline";
    deadline.textContent = "Must be gone by " + formatDeadline(item.deadline);

    const condition = makeConditionRating(item.condition);

    const seller = document.createElement("p");
    seller.className = "seller-name";
    seller.textContent = "Listed by " + item.seller;

    const isSaved = savedIds.indexOf(item.id) !== -1;
    const actions = document.createElement("div");
    actions.className = "listing-actions";
    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "button secondary";
    saveButton.textContent = isSaved ? "Saved ✓" : "Save";
    saveButton.setAttribute("aria-pressed", isSaved ? "true" : "false");
    saveButton.addEventListener("click", function () {
      toggleSaved(item.id);
    });

    const messageButton = document.createElement("button");
    messageButton.type = "button";
    messageButton.className = "button";
    messageButton.textContent = "Message seller";
    messageButton.addEventListener("click", function () {
      activeConversationId = String(item.id);
      if (!conversations[activeConversationId]) {
        conversations[activeConversationId] = [];
      }
      storage.set("marketMessages", conversations);
      renderMessages();
      window.location.hash = "messages";
    });

    actions.append(messageButton, saveButton);
    details.append(tag, title, text, price, deadline, condition, feeText, seller, actions);
    card.append(image, details);
    return card;
  }

  function toggleSaved(id) {
    if (savedIds.indexOf(id) === -1) {
      savedIds.push(id);
    } else {
      savedIds = savedIds.filter(function (savedId) { return savedId !== id; });
    }
    storage.set("savedIds", savedIds);
    renderListings();
  }

  function updateCategoryCounts() {
    const selectedCategory = categoryFilter.value || "All";
    const counts = {};
    LISTINGS.forEach(function (item) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });

    const categories = ["All"].concat(Object.keys(counts).sort());
    categoryFilter.replaceChildren();
    categories.forEach(function (category) {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category === "All"
        ? "All categories (" + LISTINGS.length + ")"
        : category + " (" + counts[category] + ")";
      categoryFilter.append(option);
    });
    categoryFilter.value = categories.indexOf(selectedCategory) !== -1 ? selectedCategory : "All";
  }

  function renderListings() {
    const query = searchBox.value.trim().toLowerCase();
    const category = categoryFilter.value;
    const priceRange = priceFilter.value;

    updateCategoryCounts();

    const matchesPriceRange = function (price) {
      if (priceRange === "under-15") return price < 15;
      if (priceRange === "15-30") return price >= 15 && price < 30;
      if (priceRange === "30-50") return price >= 30 && price < 50;
      if (priceRange === "over-50") return price >= 50;
      return true;
    };

    const matches = LISTINGS.filter(function (item) {
      const text = (item.name + " " + item.category + " " + item.description).toLowerCase();
      const matchesQuery = text.indexOf(query) !== -1;
      const matchesCategory = category === "All" || item.category === category;
      return matchesQuery && matchesCategory && matchesPriceRange(Number(item.price));
    });

    let filterCount = 0;
    if (category !== "All") filterCount++;
    if (priceRange !== "All") filterCount++;
    activeFilterCount.textContent = String(filterCount);
    activeFilterCount.hidden = filterCount === 0;

    grid.replaceChildren.apply(grid, matches.map(makeCard));
    emptyMessage.hidden = matches.length > 0;
    savedCount.textContent = savedIds.length === 0
      ? "Tap Save on anything you like."
      : "You've saved " + savedIds.length + " item(s) on this device.";
  }

  searchBox.addEventListener("input", renderListings);
  categoryFilter.addEventListener("change", renderListings);
  priceFilter.addEventListener("change", renderListings);

  filterButton.addEventListener("click", function () {
    const isOpen = filterPanel.hidden;
    filterPanel.hidden = !isOpen;
    filterButton.setAttribute("aria-expanded", String(isOpen));
  });

  clearFilters.addEventListener("click", function () {
    categoryFilter.value = "All";
    priceFilter.value = "All";
    renderListings();
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".filter-control")) {
      filterPanel.hidden = true;
      filterButton.setAttribute("aria-expanded", "false");
    }
  });

  // ----------------------------------------------------------
  // 5. Messages: listing-based conversations saved in this browser.
  // ----------------------------------------------------------
  const conversationList = document.getElementById("conversation-list");
  const noConversations = document.getElementById("no-conversations");
  const conversationHeader = document.getElementById("conversation-header");
  const messageList = document.getElementById("message-list");
  const messageForm = document.getElementById("message-form");
  const messageStatus = document.getElementById("message-status");

  function getListing(id) {
    return LISTINGS.find(function (item) { return String(item.id) === String(id); });
  }

  function renderMessages() {
    conversationList.replaceChildren();
    const conversationIds = Object.keys(conversations).filter(function (id) {
      return conversations[id] && conversations[id].length > 0;
    });

    noConversations.hidden = conversationIds.length > 0 || Boolean(activeConversationId);
    conversationIds.forEach(function (id) {
      const item = getListing(id);
      if (!item) return;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "conversation-link";
      button.setAttribute("aria-current", id === activeConversationId ? "true" : "false");
      const name = document.createElement("strong");
      name.textContent = item.name;
      const preview = document.createElement("span");
      const messages = conversations[id];
      preview.textContent = messages[messages.length - 1].body;
      button.append(name, preview);
      button.addEventListener("click", function () {
        activeConversationId = id;
        renderMessages();
      });
      conversationList.append(button);
    });

    const currentItem = activeConversationId && getListing(activeConversationId);
    conversationHeader.replaceChildren();
    messageList.replaceChildren();
    messageForm.hidden = !currentItem;
    if (!currentItem) {
      const title = document.createElement("h2");
      title.textContent = "Select a conversation";
      conversationHeader.append(title);
      return;
    }

    const title = document.createElement("h2");
    title.textContent = currentItem.name;
    const subtitle = document.createElement("p");
    subtitle.textContent = "Listed by " + currentItem.seller;
    conversationHeader.append(title, subtitle);

    (conversations[activeConversationId] || []).forEach(function (message) {
      const bubble = document.createElement("article");
      bubble.className = "message-bubble";
      const sender = document.createElement("strong");
      sender.textContent = message.sender;
      const body = document.createElement("p");
      body.textContent = message.body;
      const timestamp = document.createElement("time");
      const sentAt = new Date(message.sentAt);
      timestamp.dateTime = sentAt.toISOString();
      timestamp.textContent = sentAt.toLocaleString(undefined, {
        month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
      });
      bubble.append(sender, body, timestamp);
      messageList.append(bubble);
    });
    messageList.scrollTop = messageList.scrollHeight;
  }

  messageForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const sender = messageForm.elements.sender.value.trim();
    const body = messageForm.elements.body.value.trim();
    if (!sender || !body || !activeConversationId) return;

    const messages = conversations[activeConversationId] || [];
    messages.push({ sender: sender, body: body, sentAt: new Date().toISOString() });
    conversations[activeConversationId] = messages;
    if (!storage.set("marketMessages", conversations)) {
      messages.pop();
      messageStatus.textContent = "Could not save your message in this browser. Free up storage and try again.";
      return;
    }

    messageForm.elements.body.value = "";
    messageStatus.textContent = "Message sent in this browser prototype.";
    renderMessages();
  });

  // ----------------------------------------------------------
  // 6. Sell page: require a photo and store the listing locally.
  // ----------------------------------------------------------
  const sellForm = document.getElementById("sell-form");
  const priceInput = sellForm.elements.price;
  const feeNote = document.getElementById("fee-note");
  const formStatus = document.getElementById("form-status");
  const deadlineInput = sellForm.elements.deadline;
  const photoInput = document.getElementById("photo-input");
  const photoPreview = document.getElementById("photo-preview");
  let selectedPhoto = "";

  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");
  deadlineInput.min = todayString;

  function preparePhoto(file) {
    return new Promise(function (resolve, reject) {
      if (file.size > 10 * 1024 * 1024) {
        reject(new Error("Choose a photo smaller than 10 MB."));
        return;
      }
      const reader = new FileReader();
      reader.onerror = function () { reject(new Error("The photo could not be read. Try another image.")); };
      reader.onload = function () {
        const image = new Image();
        image.onerror = function () { reject(new Error("That image could not be opened. Try another photo.")); };
        image.onload = function () {
          const scale = Math.min(1, 900 / Math.max(image.width, image.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(image.width * scale);
          canvas.height = Math.round(image.height * scale);
          const context = canvas.getContext("2d");
          if (!context) {
            reject(new Error("Photo preview is unavailable in this browser."));
            return;
          }
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          try {
            resolve(canvas.toDataURL("image/jpeg", 0.78));
          } catch (error) {
            reject(new Error("The photo could not be prepared. Try another image."));
          }
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  photoInput.addEventListener("change", function () {
    selectedPhoto = "";
    photoPreview.hidden = true;
    formStatus.textContent = "";
    const file = photoInput.files[0];
    if (!file) return;
    if (file.type.indexOf("image/") !== 0) {
      formStatus.textContent = "Choose an image file for the listing photo.";
      photoInput.value = "";
      return;
    }
    preparePhoto(file).then(function (photo) {
      selectedPhoto = photo;
      photoPreview.src = photo;
      photoPreview.hidden = false;
    }).catch(function (error) {
      formStatus.textContent = error.message;
      photoInput.value = "";
    });
  });

  priceInput.addEventListener("input", function () {
    const price = Number(priceInput.value);
    if (price > 0) {
      const fee = price * 0.05;
      feeNote.textContent = "Move Out Market fee: " + formatMoney(fee) +
        " (5%) · Seller receives " + formatMoney(price - fee);
    } else {
      feeNote.textContent = "Move Out Market collects a 5% fee after a sale.";
    }
  });

  sellForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!selectedPhoto) {
      formStatus.textContent = "Add an item photo before posting your listing.";
      return;
    }
    const formData = new FormData(sellForm);
    const condition = Number(formData.get("condition"));
    if (!condition || condition < 1 || condition > 5) {
      formStatus.textContent = "Choose an item condition from 1 to 5 stars.";
      return;
    }
    const item = {
      id: Date.now(),
      name: formData.get("name").trim(),
      seller: formData.get("seller").trim(),
      category: formData.get("category"),
      price: Number(formData.get("price")),
      deadline: formData.get("deadline"),
      condition: condition,
      description: formData.get("description").trim(),
      image: selectedPhoto
    };

    customListings.unshift(item);
    if (!storage.set("customListings", customListings)) {
      customListings.shift();
      formStatus.textContent = "Could not save this listing. The photo may exceed this browser's available storage.";
      return;
    }
    LISTINGS.unshift(item);
    sellForm.reset();
    selectedPhoto = "";
    photoPreview.removeAttribute("src");
    photoPreview.hidden = true;
    feeNote.textContent = "Move Out Market collects a 5% fee after a sale.";
    formStatus.textContent = "Your listing was posted successfully.";
    renderListings();
  });

  // ----------------------------------------------------------
  // 7. Start up.
  // ----------------------------------------------------------
  updateAccountButton();
  renderListings();
  renderMessages();
  showView();
})();
