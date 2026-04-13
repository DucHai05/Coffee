    package com.example.serviceuser.controller;

    import com.example.serviceuser.dto.LoginRequest;
    import com.example.serviceuser.dto.RegisterRequest;
    import com.example.serviceuser.service.AuthService;
    import lombok.RequiredArgsConstructor;
    import org.springframework.security.core.Authentication;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.authentication.AuthenticationManager;
    import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
    import org.springframework.web.bind.annotation.*;

    import java.util.Map;

    @RestController
    @RequestMapping("/api/auth")
    @RequiredArgsConstructor
    public class AuthController {

        private final AuthService authService;

        @Autowired
        private AuthenticationManager authenticationManager;
        // ĐĂNG KÝ (Tạo Thương hiệu + Quản lý)
        @PostMapping("/register")
        public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
            try {
                String message = authService.register(request);
                return ResponseEntity.ok(Map.of("message", message));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
        }

        // ĐĂNG NHẬP
        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody LoginRequest request) {
            try {
                // GỌI HÀM LOGIN DETAIL
                Map<String, Object> result = authService.loginDetail(
                        request.getTenDangNhap(),
                        request.getMatKhau()
                );
                return ResponseEntity.ok(result);
            } catch (RuntimeException e) {
                return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
            }
        }

        // QUÊN MẬT KHẨU - Bước 1: Gửi OTP
        @PostMapping("/forgot")
        public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
            try {
                String email = request.get("email");
                String result = authService.sendOTP(email);
                return ResponseEntity.ok(Map.of("message", result));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
        }

        @PostMapping("/verify-otp")
        public ResponseEntity<?> verifyOTP(@RequestBody Map<String, Object> request) {
            try {
                String email = (String) request.get("email");
                int otp = Integer.parseInt(request.get("otp").toString());

                String result = authService.verifyOTP(email, otp);
                return ResponseEntity.ok(Map.of("message", result));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
        }

        // QUÊN MẬT KHẨU - Bước 3: Reset Password
        @PostMapping("/reset")
        public ResponseEntity<?> resetPassword(@RequestBody Map<String, Object> request) {
            try {
                String email = (String) request.get("email");
                int otp = Integer.parseInt(request.get("otp").toString());
                String newPass = (String) request.get("newPassword");

                String result = authService.resetPassword(email, otp, newPass);
                return ResponseEntity.ok(Map.of("message", result));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
        }
        @PostMapping("/change-password")
        public ResponseEntity<?> changePassword(
                @RequestBody Map<String, String> request
        ) {
            try {
                String oldPass = request.get("oldPassword");
                String newPass = request.get("newPassword");

                String result = authService.changePassword(oldPass, newPass);
                return ResponseEntity.ok(Map.of("message", result));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
        }
    }