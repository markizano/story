
# story.markizano.net
This is my project to run my story.

My goal is to make it incredibly easy to access my content, but also make it easy to display my quality content.
The site will be broken down into 2 main components: server and web.

Both will be installed into the final environment. The result will be an initial sign-in page and maybe some thriller
content that showcases some of the work I'm building. Once you sign up, you get prompted to make a payment of $1 [1].
Once you pay, you will have access to all the stories and content I have available.

I can maintain the project in Angular for the time being because this will give me the most flexibility on site designs
and layouts. If I later decide to create some kind of admin form, I can build that out to maintain the stories.

I plan on producing videos, images, text and eventually interactive content behind the $1 to get you started.
The idea is to make the content so easy to access. I can't stop you from pirating my stuff, but I can at least make it
easy to support the original artwork and a place to permanently host and manage it.

[1]: At first, I will just support Stripe. @FutureFeature: I plan on supporting also Plaid, Venmo, CashApp, Bitcoin and
Ethereum. Yes, I want some kind of way you can sign something with your wallet and I keep track of that along with txn
hash as proof you paid. I think that could be kewl.

# Design and Architecture
This app will consist of a server component built in ExpressJS and a web/client component in Angular. The server component
is responsible for handling the payment, tracking logins, sorting and rendering content to the front-end and intercepting
requests to view media.

The web components will be responsible for rendering the results to the end-user in a beautiful and eye-popping way.
The story of Markizano Draconus is full of action and energy, but is also very deep and emotional. Animations on the
site need to reflect and mimic this style of rendering.

This app will connect to a MongoDB endpoint which will be configured into the app. In this way, it doesn't matter how
many instances are running -- the app should always render the same experience.
