// Check if the current website is wol.jw.org
if (window.location.hostname === "wol.jw.org") {
  // Select all search result elements on the page
  const results = document.querySelectorAll("ul.results");
  const scriptureExcerpts = [];

  // Loop through each search result element
  results.forEach(result => {
    // Extract the scripture text from each search result element
    const scriptureElements = result.querySelectorAll(".bibleCitation p");
    const scriptureTexts = Array.from(scriptureElements).map(scriptureElement => {
      const innerText = scriptureElement.innerText.trim().replace(/\+/g, '').replace(/<\/?strong>/g, '');
      return innerText.replace(/<\/?span[^>]*>/g, '');
    });

    // Extract the book, chapter, and verse information from each search result element
    const bookChapterVerse = result.querySelector(".cardTitleBlock .cardLine1").textContent.trim();
    const [bookChapter, ...verses] = bookChapterVerse.split(':');
    const lastSpaceIndex = bookChapter.lastIndexOf(' ');
    const book = bookChapter.substring(0, lastSpaceIndex);
    const chapter = bookChapter.substring(lastSpaceIndex + 1);

    if (verses[0] === "1" || verses[0].startsWith("1-")) {
      scriptureTexts[0] = scriptureTexts[0].replace(chapter, "1");
    }    

    // Merge multiple search result elements from the same chapter into one excerpt
    const lastExcerpt = scriptureExcerpts[scriptureExcerpts.length - 1];
    if (lastExcerpt && lastExcerpt.book === book && lastExcerpt.chapter === chapter) {
      lastExcerpt.verses.push(...verses);
      lastExcerpt.scriptureText += `... ${scriptureTexts.join(' ')}`;
    } else {
      scriptureExcerpts.push({
        book,
        chapter,
        verses,
        scriptureText: scriptureTexts.join(' ')
      });
    }
  });

  // Create a formatted message with all of the extracted scripture excerpts
  const copiedMessage = scriptureExcerpts
    .map(excerpt => `${excerpt.book} ${excerpt.chapter}:${excerpt.verses.join(',')} — ${excerpt.scriptureText}`)
    .join('\n\n')
    .replaceAll("*", "");

  

  // Copy the message to the user's clipboard and show a notification
  if (copiedMessage !== "") {
    navigator.clipboard.writeText(copiedMessage)
      .then(() => {
        // Log a message to the console indicating that the scripture was copied
        console.log(copiedMessage);

        // Create a notification element with the copied message
        const notification = document.createElement('div');
        notification.innerText = "Scripture copied! Now buy Alan a cup of coffee :)";
        notification.style.position = 'fixed';
        notification.style.top = '60px'; // match the position of the website's top menu
        notification.style.right = '10px'; // align the notification with the right edge of the screen
        notification.style.padding = '10px';
        notification.style.backgroundColor = '#fff8dc'; // match the website's light yellow color
        notification.style.border = '1px solid #d3c28f'; // match the website's border color
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0px 0px 5px #d3c28f'; // add a subtle shadow to the notification
        notification.style.fontSize = '14px';
        notification.style.zIndex = '9999';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 1s';
        notification.style.fontFamily = 'NotoSans';

        // Add the notification element to the page
        document.body.appendChild(notification);

        // Fade in the notification element
        setTimeout(() => {
          notification.style.opacity = '1'
          notification.style.backgroundColor = '#2D2D2D';
          notification.style.color = '#FFF';
          notification.style.padding = '10px 20px';
          notification.style.borderRadius = '4px';
          notification.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.25)';
          notification.style.fontWeight = 'bold';
        }, 100);

        // Fade out and remove the notification element after 5 seconds
        setTimeout(() => {
          notification.style.opacity = '0';
          setTimeout(() => {
            document.body.removeChild(notification);
          }, 1000);
        }, 5000);
      })
      .catch(error => {
        // Log an error message if there was a problem copying the scripture
        console.error("Failed to copy scripture:", error);
      });
    } else {
      console.log("This script only works on wol.jw.org");
    }
  }