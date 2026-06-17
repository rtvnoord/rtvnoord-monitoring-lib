export interface FeedbackButtonProps {
    /** Override BEHEER_API_URL — default uit NEXT_PUBLIC_BEHEER_API_URL of toolbox.rtvnoord.nl */
    beheerUrl?: string;
    /** Override de positie van de knop. Default: rechtsonder (bottom-right). */
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    /** Verberg de knop helemaal — voor tools die hun eigen trigger willen tonen via openFeedback() prop later. */
    hidden?: boolean;
    /** Hint voor de afzender — bv. ingelogde gebruiker. Wordt server-side gebruikt voor de mail. */
    userEmail?: string;
    userName?: string;
}
export declare function FeedbackButton({ beheerUrl, position, hidden, userEmail, userName, }?: FeedbackButtonProps): import("react").JSX.Element | null;
export default FeedbackButton;
