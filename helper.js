const loading_spin = document.querySelector("#loading-spinner");
const post_content = document.querySelector("#post_content");
const post_title = document.querySelector("#post_title");
const post_description = document.querySelector("#post_description");
const post_author = document.querySelector("#post_author")
var sorted_data = [];
const post_image = document.getElementById("post-spotlightimage");
const post_entire_image = document.getElementById("post-entire");
loading_spin.style.display = 'block';
post_content.style.display = 'none';

async function fetchData() {
    try {
        const post_response = await fetch("https://api.nasa.gov/planetary/apod?api_key=gaff4Pwpu0Qg6woyFty1YhVRxhj4In1ImvOCyFD7&start_date=2022-10-01&end_date=2022-10-29&thumbs=true")
        const post_data = await post_response.json();
        sorted_data = post_data.sort((a, b) => b.date.localeCompare(a.date));
        const media_type = sorted_data[0]['media_type'];
        loading_spin.style.display = 'none';
        post_content.style.display = 'flex';
        post_title.innerHTML = sorted_data[0]['title'];
        post_description.innerHTML = sorted_data[0]['explanation'];
        post_author.innerHTML = sorted_data[0]['copyright'];
        if(media_type && (media_type == 'image')) {
            const imageItem = sorted_data[0];
            post_entire_image.setAttribute('href',imageItem['url']);
            post_image.setAttribute('src', imageItem['url']);
            post_image.setAttribute('alt', imageItem['title']);
            post_image.src = imageItem['url'];
        } else {
            const imageItem = sorted_data[0];
            post_entire_image.setAttribute('href',imageItem['thumbnail_url']);
            post_image.setAttribute('src', imageItem['thumbnail_url']);
            post_image.setAttribute('alt', imageItem['title']);
        }
      	return sorted_data;
    } catch (error) {
        loading_spin.style.display = 'block';
        console.error(error);
    }
}

function createScrollItem(title, date,url,id,explanation,author) {
    const post_anchor_item = document.createElement('p')
    post_anchor_item.classList.add('scrollimage')
    post_anchor_item.setAttribute("onclick",`spotlight("${title}","${date}","${url}","${explanation}","${author}")`);
    
		const item = document.createElement("div");
    item.classList.add("element");
    
  	// image
    const img = document.createElement("img");
    img.src = url;
    item.appendChild(img);
    
		//date
    const post_date = document.createElement('p');
    // post_author.t
    post_date.innerHTML = date;
    item.appendChild(post_date);
    
  	// title
    const h4 = document.createElement("p");
    h4.textContent = title;
    item.appendChild(h4);
    post_anchor_item.appendChild(item);

    return post_anchor_item;
}
function spotlight(title,date,url,explanation,author){
    console.log(title);
    post_title.innerHTML = title;
    post_description.innerHTML = explanation;
    post_author.innerHTML = author;
    post_image.setAttribute('src', url);
    post_image.setAttribute('alt', title);
}
function generateScrollLayout() {
  const scrollItemContainer = document.querySelector(".post-scroller-container");
  const scrollRow = document.createElement("div");
  scrollRow.classList.add('scroll_row');
  scrollItemContainer.appendChild(scrollRow);
  const scrollColumn = document.createElement("div");
  scrollColumn.classList.add('scroll_col');
  scrollRow.appendChild(scrollColumn);
  const scrollItems = document.createElement("div");
  scrollItems.classList.add('scroll_elements');
  scrollColumn.appendChild(scrollItems);
  return scrollColumn;
}
async function createScrollItems(fetchedData) {
    var id = 0;
    var start = 1;
    var end = 1;
    if(fetchedData.length >= 7) {
        var scroll_idx = 0;
        var idx = 0;
        var row_idx = 1;
        while(scroll_idx < (fetchedData.length/7)) {
            start = end;
            if((end + 7) < fetchedData.length) {
                end = end + 7
                var itemData = fetchedData.slice(start, (end+1));
            } else {
                end = fetchedData.length;
                var itemData = fetchedData.slice(start, (end+1));
            
            }
						var generateLayout = generateScrollLayout();
            while(start < end) {
                const scrollItemsContainer = document.querySelector(`.scroll_elements`);
                var scrollItem = {}
                if(itemData[idx]['media_type'] == 'image') {
                    scrollItem = createScrollItem(itemData[idx]['title'],itemData[idx]['date'],
                    itemData[idx]['url'],idx,itemData[idx]['explanation'],(itemData[idx]['copyright'] || ''));
                } else {
                    scrollItem = createScrollItem(itemData[idx]['title'],itemData[idx]['date'],
                    itemData[idx]['thumbnail_url'],idx,itemData[idx]['explanation'],(itemData[idx]['author'] || ''));
                }
                scrollItemsContainer.appendChild(scrollItem);
                scrollItemsContainer.style.display = 'flex';
                start += 1;
                idx = idx + 1;
            }
            idx = 0;
            scroll_idx = scroll_idx + 1;
            row_idx = row_idx + 1;
        }
    } else {
      var generateLayout = generateScrollLayout();
      const scrollItemsContainer = document.querySelector(`.scroll_elements`);
      var scrollItem = {}
      idx = 1;
      while(idx < fetchedData.length) {
        if(itemData[idx]['media_type'] == 'image') {
        	scrollItem = createScrollItem(itemData[idx]['title'],itemData[idx]['date'],
                                      itemData[idx]['url'],idx,itemData[idx]['explanation'],(itemData[idx]['copyright'] || ''));
      	} else {
        	scrollItem = createScrollItem(itemData[idx]['title'],itemData[idx]['date'],
                                      itemData[idx]['thumbnail_url'],idx,itemData[idx]['explanation'],(itemData[idx]['author'] || ''));
      	}
      	scrollItemsContainer.appendChild(scrollItem);
      	scrollItemsContainer.style.display = 'flex';
      	idx = idx + 1;
      }
    }
}
(async () => {
    var fetchedData = await fetchData();
    var scrollData = await createScrollItems(fetchedData);
})();
