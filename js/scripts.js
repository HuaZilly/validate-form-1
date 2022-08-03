// Object Validator
function Validator(options) {
    // get form element
    var formElement = document.querySelector(options.form);
    // function excute validate

    var selectorRule = {}
    var validate = function (inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage;
        // Lay ra cac rule cua selector
        var rules = selectorRule[rule.selector];
        // Lap qua tung rule va kiem tra
        for (var i = 0; i < rules.length ;++i) {
            errorMessage = rules[i](inputElement.value);
            if(errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            errorElement.classList.add('invalid')
        } else {
            errorElement.innerText = '';
            errorElement.classList.remove('invalid')
        }
        return !errorMessage;
    }
    // Xu ly lap qua cac rule (lang nghe su kien blur, on input)
    if (formElement) {

        // Khi submit form
        formElement.onsubmit = function (e) {
            e.preventDefault()
            // Lap qua tung rule & validate
            var isFormValid = true;
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if(!isValid) {
                    isFormValid = false;
                }

            })

            if(isFormValid) {
                // Submit khi ko submit voi jS
                 if (typeof options.onSubmit === 'function') {
                     var enableInput = formElement.querySelectorAll('[name]:not([disabled])')
                     var formValues = Array.from(enableInput).reduce(function (values, input){
                         console.log(input);
                         // Gán giá trị của formn vào value[input.name] eg: full name
                         return (values[input.name] = input.value) && values
                     }, {})
                     options.onSubmit(formValues)
                 } else  {
                     // Truong hop mac dinh cua trinh duyet
                     formElement.submit()
                 }
            }
        }

        options.rules.forEach(function (rule) {
            // Save rules
            if (Array.isArray(selectorRule[rule.selector])) {
                selectorRule[rule.selector].push(rule.test);
            } else {
                selectorRule[rule.selector] = [rule.test]
            }
            var inputElement = formElement.querySelector(rule.selector);
            if (inputElement) {

                // handle blur out of input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }

                // handle on input
                inputElement.oninput = function () {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    errorElement.classList.remove('invalid')
                }
            }
        });
    }
}
// Define Rules
// Nguyen tac cua cac rule
//1, Neu co loi tra ve 1 message
//2, Neu ko co loi tra ve undefined
Validator.isRequire = function (selector){
    return {
        selector: selector,
        test: function (value){
            return value.trim() ? undefined : 'Please type this field';
        }
    }
};
Validator.isEmail = function (selector){
    return {
        selector: selector,
        test: function (value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Please type email';
        }
    }
};

Validator.minLength = function (selector, min){
    return {
        selector: selector,
        test: function (value){
            return value.length >= min ? undefined : `Please type min ${min}`;
        }
    }
};

Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Wrong value'
        }
    }
}