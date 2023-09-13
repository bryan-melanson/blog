---
title: 'Network Programming'
---

[[toc]]

## Sockets

### File Descriptors

### Stream Sockets

#### Transmission Control Protocol

### Datagram Sockets

#### User Datagram Protocol

#### Internet Protocol 

### Raw Sockets

### Layered Network Protocol

- Application
- Presentation
- Session
- Transport
- Network
- Data Link
- Physical

## IP Addresses

### IPv4 vs. IPv6

### Network Byte Order

### Host Byte Order

### Host and Network Conversions

### Structs

#### addrinfo
``` c
    struct addrinfo {
        int              ai_flags;     // AI_PASSIVE, AI_CANONNAME, etc.
        int              ai_family;    // AF_INET, AF_INET6, AF_UNSPEC
        int              ai_socktype;  // SOCK_STREAM, SOCK_DGRAM
        int              ai_protocol;  // use 0 for "any"
        size_t           ai_addrlen;   // size of ai_addr in bytes
        struct sockaddr *ai_addr;      // struct sockaddr_in or _in6
        char            *ai_canonname; // full canonical hostname
        struct addrinfo *ai_next;      // linked list, next node
    };
```

#### sockaddr

``` c
struct sockaddr {
        unsigned short    sa_family;    // address family, AF_xxx
        char              sa_data[14];  // 14 bytes of protocol address
    }; 
```

#### sockaddr_in

``` c
    // (IPv4 only--see struct sockaddr_in6 for IPv6)
    
    struct sockaddr_in {
        short int          sin_family;  // Address family, AF_INET
        unsigned short int sin_port;    // Port number
        struct in_addr     sin_addr;    // Internet address
        unsigned char      sin_zero[8]; // Same size as struct sockaddr
    };
```

#### sockaddr_in6

``` c
    // (IPv6 only--see struct sockaddr_in and struct in_addr for IPv4)
    
    struct sockaddr_in6 {
        u_int16_t       sin6_family;   // address family, AF_INET6
        u_int16_t       sin6_port;     // port number, Network Byte Order
        u_int32_t       sin6_flowinfo; // IPv6 flow information
        struct in6_addr sin6_addr;     // IPv6 address
        u_int32_t       sin6_scope_id; // Scope ID
    };
    
    struct in6_addr {
        unsigned char   s6_addr[16];   // IPv6 address
    };
```
#### IP to Struct Conversion

``` c
// IPv4:

char ip4[INET_ADDRSTRLEN];  // space to hold the IPv4 string
struct sockaddr_in sa;      // pretend this is loaded with something

inet_ntop(AF_INET, &(sa.sin_addr), ip4, INET_ADDRSTRLEN);

printf("The IPv4 address is: %s\n", ip4);

// IPv6:

char ip6[INET6_ADDRSTRLEN]; // space to hold the IPv6 string
struct sockaddr_in6 sa6;    // pretend this is loaded with something

inet_ntop(AF_INET6, &(sa6.sin6_addr), ip6, INET6_ADDRSTRLEN);

printf("The address is: %s\n", ip6);
```

#### Network Address Translation

## System Calls

### getaddrinfo()

### socket()

``` c
    #include <sys/types.h>
    #include <sys/socket.h>
    
    int socket(int domain, int type, int protocol); 

    int s;
    struct addrinfo hints, *res;

    // do the lookup
    // [pretend we already filled out the "hints" struct]
    getaddrinfo("www.example.com", "http", &hints, &res);

    // again, you should do error-checking on getaddrinfo(), and walk
    // the "res" linked list looking for valid entries instead of just
    // assuming the first one is good (like many of these examples do).
    // See the section on client/server for real examples.

    s = socket(res->ai_family, res->ai_socktype, res->ai_protocol);
```

### bind()

``` c
    #include <sys/types.h>
    #include <sys/socket.h>
    
    int bind(int sockfd, struct sockaddr *my_addr, int addrlen);

    struct addrinfo hints, *res;
    int sockfd;

    // first, load up address structs with getaddrinfo():

    memset(&hints, 0, sizeof hints);
    hints.ai_family = AF_UNSPEC;  // use IPv4 or IPv6, whichever
    hints.ai_socktype = SOCK_STREAM;
    hints.ai_flags = AI_PASSIVE;     // fill in my IP for me

    getaddrinfo(NULL, "3490", &hints, &res);

    // make a socket:

    sockfd = socket(res->ai_family, res->ai_socktype, res->ai_protocol);

    // bind it to the port we passed in to getaddrinfo():

    bind(sockfd, res->ai_addr, res->ai_addrlen);
```
### connect()

``` c
    #include <sys/types.h>
    #include <sys/socket.h>
    
    int connect(int sockfd, struct sockaddr *serv_addr, int addrlen); 

    struct addrinfo hints, *res;
    int sockfd;

    // first, load up address structs with getaddrinfo():

    memset(&hints, 0, sizeof hints);
    hints.ai_family = AF_UNSPEC;
    hints.ai_socktype = SOCK_STREAM;

    getaddrinfo("www.example.com", "3490", &hints, &res);

    // make a socket:

    sockfd = socket(res->ai_family, res->ai_socktype, res->ai_protocol);

    // connect!

    connect(sockfd, res->ai_addr, res->ai_addrlen);
```

### listen()

``` c
    int listen(int sockfd, int backlog);

    getaddrinfo();
    socket();
    bind();
    listen();
    /* accept() goes here */ 
```

### accept()

``` c
    #include <sys/types.h>
    #include <sys/socket.h>
    
    int accept(int sockfd, struct sockaddr *addr, socklen_t *addrlen); 

    #include <string.h>
    #include <netdb.h>

    #define MYPORT "3490"  // the port users will be connecting to
    #define BACKLOG 10     // how many pending connections queue will hold

    int main(void)
    {
        struct sockaddr_storage their_addr;
        socklen_t addr_size;
        struct addrinfo hints, *res;
        int sockfd, new_fd;

        // !! don't forget your error checking for these calls !!

        // first, load up address structs with getaddrinfo():

        memset(&hints, 0, sizeof hints);
        hints.ai_family = AF_UNSPEC;  // use IPv4 or IPv6, whichever
        hints.ai_socktype = SOCK_STREAM;
        hints.ai_flags = AI_PASSIVE;     // fill in my IP for me

        getaddrinfo(NULL, MYPORT, &hints, &res);

        // make a socket, bind it, and listen on it:

        sockfd = socket(res->ai_family, res->ai_socktype, res->ai_protocol);
        bind(sockfd, res->ai_addr, res->ai_addrlen);
        listen(sockfd, BACKLOG);

        // now accept an incoming connection:

        addr_size = sizeof their_addr;
        new_fd = accept(sockfd, (struct sockaddr *)&their_addr, &addr_size);

        // ready to communicate on socket descriptor new_fd!
    }
```

### send() and recv()

``` c
    int send(int sockfd, const void *msg, int len, int flags); 
    int recv(int sockfd, void *buf, int len, int flags);
```

### sendto() and recvfrom()

``` c
    int sendto(int sockfd, const void *msg, int len, unsigned int flags,
               const struct sockaddr *to, socklen_t tolen); 
    int recvfrom(int sockfd, void *buf, int len, unsigned int flags,
                struct sockaddr *from, int *fromlen); 
```

### close() and shutdown()

``` c
    close(sockfd); 
    int shutdown(int sockfd, int how); 
```

### getpeername()

``` c
    #include <sys/socket.h>
    
    int getpeername(int sockfd, struct sockaddr *addr, int *addrlen); 
```

### gethostname()

``` c
    #include <unistd.h>
    
    int gethostname(char *hostname, size_t size); 
```

## Client-Server

## Advanced Techniques

<BryanMelanson />
