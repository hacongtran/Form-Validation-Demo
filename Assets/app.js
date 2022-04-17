// đối tượng Validator
function Validator(options){



        function validate(inputElement, rule){
            var errorMessage = rule.test(inputElement.value)
            var errorElement = inputElement.parentElement.querySelector(options.errorSelector);

            if (errorMessage){
                errorElement.innerText = errorMessage;
                inputElement.parentElement.classList.add('invalid');
            }
            else {
                errorElement.innerText = '';
                inputElement.parentElement.classList.remove('invalid');
            }

            return !errorMessage;
    }
    

    // lấy element của form cần validate
    var formElement = document.querySelector(options.form);

    if (formElement){
        // khi submit form
        formElement.onsubmit = function(e){
            e.preventDefault();
            
            var    isFormValid = true;

            // Lặp qua từng rules và validate
            options.rules.forEach(function (rule){
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);

                if (!isValid) {
                    isFormValid = false;
                }
                // validate(inputElement, rule);
            });
            if (isFormValid){
                if (typeof options.onSubmit === 'function') {
  
                        var enableInput = formElement.querySelectorAll('[name]');
                        var formValues = Array.from(enableInput).reduce(function (values, input){
                            values[input.name] = input.value
                            return values;
                        }, {});
                        options.onSubmit(formValues);
                } else {
                    formElement.submit();
                }
            }
        }
        
        // Xử lý lặp qua mỗi rule, và xử lý lắng nghe sự kiện
        options.rules.forEach(function (rule){

            var inputElement = formElement.querySelector(rule.selector);
            if (inputElement){
                // xử lý trường hợp blur khỏi input
                inputElement.onblur = function(){
                    validate(inputElement, rule)
                }
                // xử lý mỗi khi người dùng nhập vào input trong khi lỗi
                inputElement.oninput = function(){
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }

        });
    }
      
}

// Định nghĩa các rule
// Nguyên tắc các rule:
// 1.Khi có lỗi => Trả ra message lỗi
// 2.Nếu không có lỗi => Trả về undefined (nothing)
Validator.isRequired =  function(selector){
    return {
        selector : selector,
        test: function (value){
            return value.trim() ? undefined : 'Vui lòng nhập trường này!';
        }
    };
}
Validator.isEmail =  function(selector){
    return{
        selector : selector,
        test: function (value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập đúng email!';
         }
    };
}
Validator.minLength =  function(selector, min){
    return{
        selector : selector,
        test: function (value){
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự`;
         }
    };
}
Validator.isConfirmed =  function(selector, getConfirmValue, message ){
    return{
        selector : selector,
        test: function (value){
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không đúng !';
         }
    };
}
