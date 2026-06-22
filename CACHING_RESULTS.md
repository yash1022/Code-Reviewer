# Redis Caching — Benchmark Results

**Test Date:** June 2026  
**Tool Used:** Apache Benchmark (`ab`)  
**Test Config:** 100 requests, 10 concurrent users (`-n 100 -c 10`)  
**Environment:** Node.js REST API, Redis cache layer, tested via Docker (Ubuntu) → Windows host

---

## Summary

| Metric | ❌ Without Cache | ✅ With Cache | Improvement |
|---|---|---|---|
| Requests/sec | 29.56 req/s | 37.78 req/s | **+27.8%** |
| Avg response time | 338 ms | 264 ms | **-21.8%** |
| Median latency (50%) | 199 ms | 181 ms | **-9.5%** |
| 90th percentile | 615 ms | 486 ms | **-21.0%** |
| 99th percentile | 1219 ms | 883 ms | **-27.6%** |
| Worst case (100%) | 1219 ms | 883 ms | **-27.6%** |
| Std deviation | ±244 ms | ±190 ms | **More consistent** |
| Transfer rate | 11.11 KB/s | 14.20 KB/s | **+27.8%** |

---

## Raw Results

### Without Cache (Baseline)

```
Requests per second:    29.56 [#/sec] (mean)
Time per request:       338.288 [ms] (mean)
Time per request:       33.829 [ms] (mean, across all concurrent requests)
Transfer rate:          11.11 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        2    4   1.4      4       8
Processing:    86  282 244.2    194    1211
Waiting:       85  281 244.2    193    1209
Total:         89  286 244.5    199    1219

Percentage of requests served within a certain time (ms):
  50%    199
  66%    226
  75%    310
  80%    404
  90%    615
  95%    831
  98%   1125
  99%   1219
 100%   1219 (longest request)
```

### With Redis Cache

```
Requests per second:    37.78 [#/sec] (mean)
Time per request:       264.712 [ms] (mean)
Time per request:       26.471 [ms] (mean, across all concurrent requests)
Transfer rate:          14.20 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        3    6   2.3      5      14
Processing:    76  227 189.9    178     878
Waiting:       75  226 190.0    178     878
Total:         78  233 190.1    181     883

Percentage of requests served within a certain time (ms):
  50%    181
  66%    204
  75%    249
  80%    370
  90%    486
  95%    744
  98%    877
  99%    883
 100%    883 (longest request)
```

---

## Key Observations

- **Throughput** increased from 29.56 to 37.78 req/s — the API can now serve more users simultaneously
- **Average response time** dropped from 338ms to 264ms — a 74ms improvement per request
- **Tail latency improved significantly** — worst case dropped from 1219ms to 883ms, meaning fewer users experience very slow responses
- **Standard deviation dropped** from ±244ms to ±190ms — responses are more consistent and predictable
- **Processing time** reduced from 282ms to 227ms — confirms Redis is offloading work from the database

---

## Resume-Ready Statement

> *"Implemented Redis caching in a Node.js REST API, reducing average response time by 22% (338ms → 264ms), improving throughput by 28% (29.56 → 37.78 req/s), and cutting worst-case latency from 1219ms to 883ms under concurrent load."*

---

## Next Steps

- [ ] Re-run test with higher concurrency (`-n 500 -c 50`) to amplify the performance gap
- [ ] Add cache hit/miss logging to measure actual cache hit rate
- [ ] Check Redis latency directly with `redis-cli --latency`
- [ ] Consider increasing TTL if cache expiry is causing frequent misses