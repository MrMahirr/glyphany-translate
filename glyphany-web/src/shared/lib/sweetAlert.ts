import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const ReactSwal = withReactContent(Swal);

// Özelleştirilmiş Glyphany SweetAlert teması
export const AppAlert = ReactSwal.mixin({
  customClass: {
    container: "font-body-md", // Tailwind tipografisiyle eşleşir
    popup: "rounded-2xl shadow-xl border border-outline-variant/30 bg-surface-container-lowest",
    title: "font-headline-sm text-on-surface",
    htmlContainer: "text-on-surface-variant",
    confirmButton:
      "bg-primary text-on-primary font-label-lg px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm",
    cancelButton:
      "bg-surface-container text-on-surface-variant font-label-lg px-6 py-2.5 rounded-lg hover:bg-surface-container-high transition-colors ml-3",
  },
  buttonsStyling: false,
});
