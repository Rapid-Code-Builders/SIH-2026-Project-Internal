from app.auth.security import hash_password, verify_password


password = "Kinaara123"

hashed = hash_password(password)

print("Original:", password)
print("Hashed:", hashed)
print("Correct password:", verify_password(password, hashed))
print("Wrong password:", verify_password("WrongPassword", hashed))