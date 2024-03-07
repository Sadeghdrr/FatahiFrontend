export const SERVER_URL = "http://localhost:8000";

export function NotificationModal(icon, title, text) {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
    });
}