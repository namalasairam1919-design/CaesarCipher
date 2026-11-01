
package com.caesar;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class CipherController {

    @PostMapping("/encrypt")
    public CipherResponse encrypt(@RequestBody CipherRequest request) {
        return process(request, true);
    }

    @PostMapping("/decrypt")
    public CipherResponse decrypt(@RequestBody CipherRequest request) {
        return process(request, false);
    }

    private CipherResponse process(CipherRequest request, boolean encrypt) {

        if (request == null || request.message() == null) {
            throw new IllegalArgumentException("Message is required");
        }

        String message = request.message();

        if (message.length() > 500) {
            throw new IllegalArgumentException("Maximum 500 characters allowed");
        }

        int shift = request.shift();

        if (shift < 1 || shift > 25) {
            throw new IllegalArgumentException("Shift must be between 1 and 25");
        }

        if (!encrypt) {
            shift = 26 - shift;
        }

        StringBuilder result = new StringBuilder();

        for (char c : message.toCharArray()) {
            if (c >= 'A' && c <= 'Z') {
                result.append((char) ('A' + (c - 'A' + shift) % 26));
            } else if (c >= 'a' && c <= 'z') {
                result.append((char) ('a' + (c - 'a' + shift) % 26));
            } else {
                result.append(c);
            }
        }

        return new CipherResponse(result.toString());
    }

    public record CipherRequest(String message, int shift) {}
    public record CipherResponse(String result) {}
}

