# non-distribution

This milestone aims (among others) to refresh (and confirm) everyone's
background on developing systems in the languages and libraries used in this
course.

By the end of this assignment you will be familiar with the basics of
JavaScript, shell scripting, stream processing, Docker containers, deployment
to AWS, and performance characterization—all of which will be useful for the
rest of the project.

Your task is to implement a simple search engine that crawls a set of web
pages, indexes them, and allows users to query the index. All the components
will run on a single machine.

## Getting Started

To get started with this milestone, run `npm install` inside this folder. To
execute the (initially unimplemented) crawler run `./engine.sh`. Use
`./query.js` to query the produced index. To run tests, do `npm run test`.
Initially, these will fail.

### Overview

The code inside `non-distribution` is organized as follows:

```
.
├── c            # The components of your search engine
├── d            # Data files like the index and the crawled pages
├── s            # Utility scripts for linting and submitting your solutions
├── t            # Tests for your search engine
├── README.md    # This file
├── crawl.sh     # The crawler
├── index.sh     # The indexer
├── engine.sh    # The orchestrator script that runs the crawler and the indexer
├── package.json # The npm package file that holds information like JavaScript dependencies
└── query.js     # The script you can use to query the produced global index
```

### Submitting

To submit your solution, run `./scripts/submit.sh` from the root of the stencil. This will create a
`submission.zip` file which you can upload to the autograder.

# M0: Setup & Centralized Computing

> Add your contact information below and in `package.json`.

* name: `<ruoqian zhang>`

* email: `<ruoqian_zhang@brown.edu>`

* cslogin: `<rzhan221>`


## Summary

> Summarize your implementation, including the most challenging aspects; remember to update the `report` section of the `package.json` file with the total number of hours it took you to complete M0 (`hours`), the total number of JavaScript lines you added, including tests (`jsloc`), the total number of shell lines you added, including for deployment and testing (`sloc`).


My implementation consists of 5 components addressing T1--8 and 8 test cases testing my components. The most challenging aspect was config enviroment and to dubug my implementation because there are some confict parts between windows and linux such as line ending. And it also a little bit hard to debug, beacause I'm not fimilar with debugging on shell. It took me about 15-20 hours to complete M0 and added total about 60-90 JS lines and 100-120 lines shell including for deploment and testing.


## Correctness & Performance Characterization


> Describe how you characterized the correctness and performance of your implementation.


To characterize correctness, we developed 8 tests that test the following cases: 
1. Verify whether the text and URL can be correctly returned when the `href` attribute is empty.  
2. Check if queries containing 2-grams can be successfully processed.  
3. Ensure that results are correctly sorted when the `freq` value is very large.  
4. Basic functionality testing.


*Performance*: The throughput of various subsystems is described in the `"throughput"` portion of package.json by using url/s. The characteristics of my development machines are summarized in the `"dev"` portion of package.json.


## Wild Guess

> How many lines of code do you think it will take to build the fully distributed, scalable version of your search engine? Add that number to the `"dloc"` portion of package.json, and justify your answer below.
To build a fully distributed and scalable version of the search engine, we estimate that approximately 4000 - 5,000 lines of code (dloc) will be required. This may include:

Core Search Functionality (2,000 LOC): Implementing efficient indexing, ranking, and query execution mechanisms that can handle distributed processing.
Distributed Systems Integration (1,500 LOC): Implementing communication protocols, load balancing, and distributed storage handling.
Scalability Enhancements (1,000 LOC): Adding support for horizontal scaling, caching, and optimized data replication.
Testing (500 LOC): Implementing unit tests, performance monitoring, and fine-tuning for optimal efficiency.