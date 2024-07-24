package org.server.socialapp.util;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

public class RateLimitingFilter implements Filter {
	private final ConcurrentMap<String, Bucket> buckets = new ConcurrentHashMap<>();

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
	}

	@Override
	public void doFilter(ServletRequest request , ServletResponse response , FilterChain chain)
			throws IOException, ServletException {
		String ipAddress = request.getRemoteAddr();
		Bucket bucket = buckets.computeIfAbsent(ipAddress , this::newBucket);

		if (bucket.tryConsume(1)) {
			chain.doFilter(request , response);
		} else {
			HttpServletResponse httpResponse = (HttpServletResponse) response;
			httpResponse.setStatus(HttpServletResponse.SC_REQUEST_TIMEOUT);
			httpResponse.getWriter().write("Too many requests");
		}
	}

	@Override
	public void destroy() {
	}

	private Bucket newBucket(String key) {
		Refill refill = Refill.intervally(30 , Duration.ofMinutes(1));
		Bandwidth limit = Bandwidth.classic(30 , refill);
		return Bucket.builder().addLimit(limit).build();
	}
}
