export class ErrorHandler {
    constructor(errorText, errorStyle = null, callback, errorType = null,) {
        this.errorText = errorText;
        this.errorType = errorType;
        this.errorStyle = errorStyle;
        this.callback = callback;
        this.lifeTime = 10000;
        this.currentError = this.createError();

        this.showError();
    }

    createError() {
        let $icon = $('<i class="material-icons left">error</i>');

        if (this.errorType === "warning") {
            $icon = $('<i class="material-icons left">warning</i>');
        }

        return $('<span>' + this.errorText + '</span>').append($icon);
    }

    showError() {
        Materialize.toast(this.currentError, this.lifeTime, this.errorStyle);

        this.callCallback();
    }

    removeError() {
        this.currentError.remove();
    }

    callCallback() {
        if (this.callback && this.callback !== void 0) {
            this.callback();
        }
    }
}