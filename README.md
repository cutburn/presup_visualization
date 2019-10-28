# presup_visualization
This graphic visualization tool is the culminating project of some undergrad research I embarked on back in 2010 and 2011. The idea behind it is that verb phrases (VPs for short) are often expressed in clausal pairs, e.g. "she [VP1] him and he [VP2] her", or "he [VP1] them but they [VP2] him". Based on this idea, we could accumulate a huge corpus of similar pairs just by formulating wildcard searches and plugging them into search engines (we used Google and Yahoo! back then, I believe). After these were accumulated the pairs had to be coded (e.g. GG or "good for good", a "good" VP like "love" in exchange for another "good" like "hug", GB or "good for bad" as in "forgive" in exchange for "hurt"). With this data, our thinking was that we could try to predict the sentiment outcome of complex chains of these kinds of exchanges using an N-gram model.

In parts the code is a little hairy, and the VP2 "open-ended" mode wasn't implemented (I seem to recall getting bogged down in the Sisyphean drudgery of having to clean and verify the enormous text corpus, leaving less time for the fun stuff), but I may come back to it to give it a bit more polish as I have time.

# Screenshots
Here are some action shots of the action-reaction presuppositional pair data visualization:

![](https://github.com/hotcap/presup_visualization/blob/master/screenshots/1.png)

![](https://github.com/hotcap/presup_visualization/blob/master/screenshots/2.png)

![](https://github.com/hotcap/presup_visualization/blob/master/screenshots/3.png)

Here are some shots of the "open-ended" mode where we can enter a VP1 and see what the top N (here, N=15) most likely reactions would be, according to the data:

![](https://github.com/hotcap/presup_visualization/blob/master/screenshots/4.png)

![](https://github.com/hotcap/presup_visualization/blob/master/screenshots/5.png)

![](https://github.com/hotcap/presup_visualization/blob/master/screenshots/6.png)

![](https://github.com/hotcap/presup_visualization/blob/master/screenshots/7.png)

# Thanks
Many thanks to Prof. Roxana Girju for ideas, direction, and a ton of supplemental material and resources. Also thanks to Philipp Strathausen for the Dracula Graph library (and by corollary, Dmitry Baranovskiy's RaphaelJS) without which this would've been a lot harder.
