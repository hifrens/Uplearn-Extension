window.addEventListener("load", (event) => {
        let timeoutId;
        console.log('Uplearn Auto Quality: Injecting content.js script')
        chrome.runtime.onMessage.addListener(function(message) {
            // Handle messages from the extension's popup
            if (message.action === "updateQuality") {
                // Update the value on the main page
                localStorage.setItem('ulExtQuality', message.value);
            }
            if (message.action === "updateSpeed") {
                // Update the value on the main page
                localStorage.setItem('ulExtSpeed', message.value);

                // Clear the previous timeout
                clearTimeout(timeoutId);

                // Set a new timeout
                timeoutId = setTimeout(() => {
                    var r = document.querySelectorAll('video')[0];
                    r.playbackRate = message.value;
                }, 350);
            }
        });
    
    
    quality = localStorage.getItem('ulExtQuality');
    speed = localStorage.getItem('ulExtSpeed');
    theme = localStorage.getItem('ulExtTheme');

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    sleep(2000).then(() => {

        var r = document.querySelectorAll('video')[0];
        if (r) {
            r.playbackRate = speed;
            console.log('=== SPEED CHANGED ===')
            
            function waitForElement(selector, callback) {
                var element = document.querySelector(selector);
                if (element) {
                    callback(element);
                } else {
                    setTimeout(function() {
                        waitForElement(selector, callback);
                    }, 1); // Adjust the delay as needed
                }
            }
            
            // First element
            waitForElement('[data-handle="settingsButton_icon_wrapper"]', function(one) {
                one.click();
            
                // Second element
                waitForElement('[data-handle="quality"]', function(two) {
                    two.click();
            
                    // Third element
                    let tempQual = '';
    
                    if (quality == 'Auto') {
                        tempQual = 'Auto'
                    }
                    else {
                        tempQual = `${quality}p`
                    }
    
                    if (quality == 'Highest') {
                        tableBox = document.getElementsByClassName('w-check-menu-body')[1].children
                        tableBox[tableBox.length-1].children[1].click() // Click the highest quality in the quality box.
                    }
                    else {
                        waitForElement(`[value="${tempQual}"]`, function(three) {
                            three.click();
                            console.log('after');
                        });
                    }
                    one.click()
                });
            });
        }
        else
        {
            console.log('Taking too long to find video, assuming no videos on page.')
        }
    });
});
