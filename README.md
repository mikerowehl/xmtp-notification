# XMTP Notification Demo

Demonstration of sending notifications using [XMTP](https://xmtp.org/).
I'm not involved with the
project, just happened to run across it while looking up something else. I
figured it might be something useful to try out. The use case that it matched
for me was notifications to go along with online content. And while I was
exploring it did seem like Paragraph has some XMTP delivery somewhere. I
haven't been able to find it yet. So instead I just made a quick example
spinning up a few listeners and sending them messages from a notifier script.
As of this writing all the XMTP stuff is still very much under development, so
I have no idea for how long this will work. Especially if you try to send from
an unfunded wallet the way this code does it.

## TL;DR

Start up each of the consumer processes. I have script aliases defined for 3
of them. I normally run each in a different window:

```
npm run consumer1
npm run consumer2
npm run consumer3
```

As each one starts up it'll create the environment it needs to connect to XMTP
devnet and start listening. It also writes the Ethereum address it just
created into the `notificationList.txt` file in the current directory.

Then run the notifier and it sends a message to each of the consumers:

```
npm run notify -- "This is your notification"
```

Each of the consumers should just write out the message on their standard
output. There's no fancy command set or anything, just some processes
listening for messages and one sending them out.

## Open Questions

All this stuff is currently handled using the xmtp agent-sdk, I just make new
listeners and the notifier. Looking at the stuff on the XMTP site I had
assumed that there was going to be more/different stuff I needed to do to send
messages. In the
[Notifi case study](https://xmtp.org/notifi-case-study) there's a mention of 
building subscriber lists without collecting private info. I thought maybe
that would be something that was built into an API. But so far I haven't seen
any mention of it. There are also a few places where the site says that 
messaging is opt-in, so I was afraid this test wasn't going to work without
some additional setup from the consumer side. But none of that seems to be the
default at the protocol/API level. Maybe some of the things mentioned on the
site are more features of particular implementations. So while it's nice that
this simple example "just works", it does make me a bit nervous that maybe my
use case won't line up with the production version - should this stuff get 
flipped into a different mode on the production network.

I'm also not sure how any state is really supposed to be handled. The setup
that we do for each account makes a local database to store some state. But
for each round of notifications I just use the Ethereum address I want to send
to and create a message to it. It's the simplest way to work, but is it the
most considerate way to do it? Should I be trying to
[check if the identity is reachable](https://docs.xmtp.org/agents/build-agents/create-conversations#check-if-an-identity-is-reachable)
before trying to send? Or should I try to cache the Inbox ID and try to use
[the Inbox ID to create a message](https://docs.xmtp.org/agents/build-agents/create-conversations#by-inbox-id-1)
instead of going back to the address? Would those things make me a more or 
less considerate consumer of the service?

And finally, in the production version there's going to be a cost associated
with sending each message. Some of my open questions might come down to which
version is the cheapest, which we can figure out once the live network is up.
But that does mean that notifications via XMTP probably scale different than
signing up for email notifications from a cost structure perspective. The cost
structure looks to be under development still. But it's sounding a lot more
linear than the cost to send email. So if you have a large subscriber base
with a relatively low response rate (you're a mass media property) it might
not really be worth sending XMTP. Unless there's some associated user
behavior that changes the unit economics there. Like if people have subscribed
with XMTP and they're getting the notification in their wallet instead of
their inbox - does that make it more likely for them to convert if the 
notification is for a commercial offer? Could be, there looks to be too much
still up in the air to be able to answer that however.
