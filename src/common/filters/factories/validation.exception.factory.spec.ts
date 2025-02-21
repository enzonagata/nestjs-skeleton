import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import validateFunction from './validation.exception.factory'; // Ajuste o caminho conforme necessário

describe('validateFunction', () => {
  it('deve lançar uma BadRequestException com erros de validação', () => {
    // Mock de um ValidationError com restrições e filhos
    const mockValidationErrors: ValidationError[] = [
      {
        property: 'email',
        constraints: {
          isEmail: 'email must be an email',
          isNotEmpty: 'email should not be empty',
        },
        children: [],
      },
      {
        property: 'password',
        constraints: {
          isString: 'password must be a string',
          minLength: 'password must be longer than or equal to 8 characters',
        },
        children: [],
      },
    ];

    // Usar a função para gerar a exceção
    expect(() => validateFunction(mockValidationErrors)).toThrowError(
      BadRequestException,
    );

    // Verificar o conteúdo da exceção
    try {
      validateFunction(mockValidationErrors);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.response).toEqual({
        errorType: 'ClassValidation',
        validationResult: [
          {
            property: 'email',
            validations: [
              'email must be an email',
              'email should not be empty',
            ],
          },
          {
            property: 'password',
            validations: [
              'password must be a string',
              'password must be longer than or equal to 8 characters',
            ],
          },
        ],
      });
    }
  });

  it('deve lançar uma BadRequestException com erros de validação aninhados', () => {
    // Mock de um ValidationError com um filho (erro aninhado)
    const mockValidationErrors: ValidationError[] = [
      {
        property: 'user',
        children: [
          {
            property: 'email',
            constraints: {
              isEmail: 'email must be an email',
            },
            children: [],
          },
          {
            property: 'password',
            constraints: {
              isString: 'password must be a string',
            },
            children: [],
          },
        ],
        constraints: {},
      },
    ];

    // Usar a função para gerar a exceção
    expect(() => validateFunction(mockValidationErrors)).toThrowError(
      BadRequestException,
    );

    // Verificar o conteúdo da exceção
    try {
      validateFunction(mockValidationErrors);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.response).toEqual({
        errorType: 'ClassValidation',
        validationResult: [
          {
            property: 'user.email',
            validations: ['email must be an email'],
          },
          {
            property: 'user.password',
            validations: ['password must be a string'],
          },
        ],
      });
    }
  });
});
