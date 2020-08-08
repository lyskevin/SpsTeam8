async function getListings() {
    let cardsContainer = document.getElementById("listings-card-container");
    let childHtmlString = "";
    var response = await fetch("/fetchRooms");
    var data = await response.json();
    var entries = data.rooms;
    var sortedEntries = getSortedEntries(entries);
    for (var i = 0; i < sortedEntries.length; i++) {
        let room = sortedEntries[i];
        childHtmlString += `<div class="shadow-sm p-3 mb-5 bg-white rounded listing-card">
      <div class="row form-group">
        <div class="col-md-6 mb-3 mb-md-0">
          <span class="card-heading title">${room.title}</span>
          <br />
          <span class="card-field">Postal Code: </span>
          <span class="card-value postal-code-value">
            ${room.deliveryLocation}
          </span>
          <br />
          <span class="card-description">
            ${room.description}
          </span>
        </div>
        <div class="col-md-6 text-right">
          <span class="card-field">Category: </span>
          <span class="card-value category-value">${room.category}</span>
          <br />
          <span class="card-field">Delivery fee: </span>
          <span class="card-value">$${room.deliveryFee}</span>
          <br />
          <br />`;
        let response2 = await fetch("/userRoomStatus?roomId=" + room.id);
        let joinAction = await response2.text();
        if (joinAction == "Join") {
            childHtmlString += `<button id="action" class="btn btn-join" onclick="joinRoom('${room.id}')">Join</button>
      </div>
    </div>
  </div>`;
        } else {
            childHtmlString += `<button id="action" class="btn btn-chat" onclick="toChat('${room.id}')">Chat</button>
      </div>
    </div>
  </div>`;
        }
    }
    cardsContainer.innerHTML = childHtmlString;
}

function getSortedEntries(entries) {
    return entries.sort((aRoom, bRoom) => {
        const aRoomOrderValue = Math.max(aRoom.ordersValue, aRoom.minPrice);
        const bRoomOrderValue = Math.max(bRoom.ordersValue, bRoom.minPrice);
        const aRoomAveragePerPersonValue = (aRoomOrderValue + aRoom.deliveryFee) / aRoom.users.length;
        const bRoomAveragePerPersonValue = (bRoomOrderValue + bRoom.deliveryFee) / bRoom.users.length;
        return aRoomAveragePerPersonValue - bRoomAveragePerPersonValue;
    })
}

async function joinRoom(roomId) {
    var formData = new FormData();
    formData.append("roomId", roomId);
    $.ajax({
        type: 'POST',
        url: "/joinRoom",
        data: { 'roomId': roomId },
        success: function(msg) {
            window.alert("Joined room!");
            window.location.reload();
        },
        error: function(msg) {
            window.alert("Something went wrong!");
        }
    });
}

function toChat(roomId) {
    window.location.href = `/roomChat.html?${roomId}`;
}

function getSearchResults() {
    // Declare variables
    let input = document.getElementById("searchBox");
    let filter = input.value.toUpperCase();
    let cardsContainer = document.getElementById("listings-card-container");
    let cards = cardsContainer.getElementsByClassName("listing-card");
    // Loop through all table rows, and hide those who don't match the search query
    for (let i = 0; i < cards.length; i++) {
        title = cards[i]
            .getElementsByClassName("title")[0]
            .innerHTML.toUpperCase();
        category = cards[i]
            .getElementsByClassName("category-value")[0]
            .innerHTML.toUpperCase();
        cardDescription = cards[i]
            .getElementsByClassName("card-description")[0]
            .innerHTML.toUpperCase();
        postalCode = cards[i]
            .getElementsByClassName("postal-code-value")[0]
            .innerHTML.toUpperCase();
        isFilterInCard =
            title.indexOf(filter) > -1 ||
            category.indexOf(filter) > -1 ||
            cardDescription.indexOf(filter) > -1 ||
            postalCode.indexOf(filter) > -1;
        if (isFilterInCard) {
            cards[i].style.display = "";
        } else {
            cards[i].style.display = "none";
        }
    }
}
async function getMyRooms() {
    var response = await fetch("/myRooms");
    var responseJson = await response.json();
    var entries = Object.entries(responseJson)
    let childHtmlString = "";
    entries.forEach(room => {
        var roomData = room[1];
        childHtmlString += `<div class="shadow-sm p-3 mb-5 bg-white rounded listing-card">
      <div class="row form-group">
        <div class="col-md-6 mb-3 mb-md-0">
          <span class="card-heading title"><a href="./room.html?${room[0]}>${roomData.title}</a></span>
          <br />
          <span class="card-field">Postal Code: </span>
          <span class="card-value postal-code-value">
            ${roomData.deliveryLocation}
          </span>
          <br />
          <span class="card-description">
            ${roomData.description}
          </span>
        </div>
        <div class="col-md-6 text-right">
          <span class="card-field">Category: </span>
          <span class="card-value category-value">${roomData.category}</span>
          <br />
          <span class="card-field">Delivery fee: </span>
          <span class="card-value">$${roomData.deliveryFee}</span>
          <br />
        </div>
      </div>
    </div>`;
    })
    document.getElementById("listings-card-container").innerHTML = childHtmlString;
}
