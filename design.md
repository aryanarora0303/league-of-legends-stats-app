# <span style="color:orange;">Battlefy Questions</span>

#### Github Link: https://github.com/aryanarora0303/league-of-legends-stats-app 
#### Application Link:  https://main.d23wtmzt4vreb.amplifyapp.com/ 

---

### <span style="color:orange;">Justify the Service Worker?</span>

A service worker is vital for our application. An important benefit and reason to use a Service worker in our application the builtin API response and resource **caching**. This helps us in significantly **improve the performance** of the application and **reduce the number of network requests** needed to fetch data. This can lead to **faster load times**, **reduced network latency**, less server costs by reduced server load and higher user engagement and satisfaction.
**Workbox** provides this functionality built-in, therefore can save us development time and resources. 

Workbox is a well-established and widely-used service worker library, with active development and **community support**. It has been thoroughly tested and is known to be **reliable** and **effective in production environments**, which means less resources spent on fixing production bugs.

Workbox offers 3 main types of **built-in caching**.
- **Network first** fetches from network and serves the response, falling back to the cache if network request fails.
- **Cache first** serves cached responses if available, otherwise fetches from network and caches the response.
- **Stale while revalidate** serves cached responses while also fetching and updating the cache in the background.

**Caching data in the frontend**, especially if it is not real-time, is a more efficient approach compared to caching in the backend. This not only **saves network costs** but also enhances the perceived speed of the application for the end user.

Given the **assumption** that the data requested is **not time-sensitive** and can be cached for up to an hour (easily adjustable in the code), I have implemented the **Stale-While-Revalidate** and **Cache-First** caching strategies. These techniques can significantly **enhance the application's response time** and **reduce server load** for both our application and third-party APIs.

### <span style="color:orange;">How would you handle the situation where your application goes over the rate limiting threshold on Riot Games' API?</span>

To handle the situation where the application goes over the rate limiting threshold on Riot Games' API, I would implement an **exponential backoff strategy**. This strategy would introduce a delay between retries that increases exponentially with each retry attempt. The delay would be capped at a maximum value to prevent excessive waiting. Additionally, I would implement **rate limiting on my application** to prevent making too many requests to the Riot API in a short amount of time.

Another way is to perform **server side caching**. Caching can be used to optimize the problem by storing frequently accessed data in memory. This reduces the need for repeated requests to the database, improving response times and reducing server load. This could be achieved by **redis**.

**LeagueJS** already handles the exponential backoff strategy and server side caching. Which saved development time and resources.

For further optimization, I suggest implementing **front end caching** via a service worker, using a library such as **Workbox**. Workbox offers **built-in caching strategies**(cache-first, network-first and stale-while-revalidate) and the ability to add custom caching tailored to specific needs. Choice of strategy can be specific use case based. 

**Caching data in the frontend**, especially if it is not real-time, is a more efficient approach compared to caching in the backend. This not only **saves network costs** but also enhances the perceived speed of the application for the end user.


### <span style="color:orange;">How would you change your code to make this application extensible for any game while keeping the code maintainable?</span>

To make this application extensible for any game while keeping the code maintainable, I would use a **modular and scalable architecture**. 

The core functionality of the application would be abstracted away into smaller, reusable modules, allowing for easy adaptation to different games. This will performed on both frontend and backend. With **modular components in frontend** and **reusable modules or functions** that can be used across different parts of the backend codebase. These components, modules or functions can be organized into **separate files or directories** for easy maintenance and scalability.
Additionally, I would use **interfaces** to define the methods and properties that must be implemented by each module, component. This would ensure that any module can be easily swapped out without breaking the application's core functionality.

Thereby making it **streamline** to document, understand, add and remove game support from the application.

### <span style="color:orange;">How would you organize the codebase for all these different functionality so the entire software is maintainable?</span>

To organize the codebase for all these different functionalities so the entire software is maintainable, I would use a **modular approach** as described in the previous question. The application would be divided into **separate component, modules or functions**, each with a **specific set of responsibilities**. Each of these smaller parts would have its own directory with its own set of files and tests, and the code would be organized in a clear and consistent manner. 

### <span style="color:orange;">Provide a list of any lessons learned from this coding exercise</span>

Lessons learned from this coding exercise include the importance of proper **error handling**, the usefulness of using a **rate limiter**, an **exponential backoff strategy** and **caching** to prevent overloading third-party APIs.

Additionally, Upon working with the League of Legends API, I have come to appreciate the importance of having a **deep understanding of the product**. As someone who has not played the game before, certain aspects of the API responses caught me off guard and required additional research on my part. For example, the API lists items as “item1”, “item2”… and so on, without declaring them in a structured object like an array or object. While a player would know that there are only six items available, I initially struggled with how to handle this situation until I was able to figure it out. This experience has **reinforced my belief that having a comprehensive understanding of the product and its usage is essential to delivering effective solutions.**

### <span style="color:orange;">Write out how you would approach this exercise differently now that you've gone through it. i.e. Given the intention was to limit development to 4 hours, how would you make use of your time differently, or, would you?</span>

In approaching this exercise differently, I would still spend a significant amount of time on the **planning and architecture phase** to ensure that the code is well-organized and maintainable. However, I would try to complete the **MVP (minimum viable product)** functionality as quickly as possible within the first two hours, and then focus on adding additional features and improvements in the remaining two hours. 