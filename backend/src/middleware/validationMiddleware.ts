import { Request, Response, NextFunction } from 'express';

// Importiamo le funzioni e i tipi da express-validator
import { body, validationResult, ValidationChain } from 'express-validator';

/**
 * userValidationRules
 * Restituisce un array di catene di validazione (ValidationChain) di express-validator.
 * Le regole sono riutilizzabili e fortemente tipizzate.
 * @returns {ValidationChain[]} - Un array di middleware di validazione.
 */
export const userValidationRules = (): ValidationChain[] => {
  return [
    // 1. Validazione del campo 'username'
    body('username')
      .trim() // Rimuove gli spazi bianchi all'inizio e alla fine
      .notEmpty().withMessage('Il campo username è obbligatorio.')
      .isLength({ min: 2 }).withMessage('Il campo username deve contenere almeno 2 caratteri.')
      .escape(), // Converte i caratteri HTML speciali (es. <, >) per prevenire attacchi XSS

    // 2. Validazione del campo 'email'
    body('email')
      .trim()
      .notEmpty().withMessage("L'email è un campo obbligatorio.")
      .isEmail().withMessage('Deve essere un indirizzo email valido.') // Controlla il formato dell'email
      .normalizeEmail({all_lowercase: true}), // Normalizza l'email (es. dominio in minuscolo)

    // 3. Validazione del campo 'password'
    body('password')
      .notEmpty().withMessage('La password è un campo obbligatorio.')
      .isLength({ min: 8 }).withMessage('La password deve contenere almeno 8 caratteri.')
      .matches(/\d/).withMessage('La password deve contenere almeno un numero.')
      .matches(/[a-z]/).withMessage('La password deve contenere almeno una lettera minuscola.')
      .matches(/[A-Z]/).withMessage('La password deve contenere almeno una lettera maiuscola.'),
      // Non è necessario usare .escape() sulla password perché non verrà mai renderizzata in HTML
      // e verrà sottoposta ad hashing prima del salvataggio.
  ];
};

/**
 * validate
 * Middleware che esegue la validazione basandosi sulle regole applicate alla rotta.
 * Controlla il risultato della validazione. Se ci sono errori, risponde con un errore 400.
 * Altrimenti, passa il controllo al middleware successivo.
 * @param {Request} req - L'oggetto della richiesta di Express.
 * @param {Response} res - L'oggetto della risposta di Express.
 * @param {NextFunction} next - La funzione per passare al middleware successivo.
 */
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  // Esegue la validazione e raccoglie eventuali errori dalla richiesta
  const errors = validationResult(req);

  // Se l'array di errori è vuoto, la validazione è superata.
  if (errors.isEmpty()) {
    // Prosegui verso il controller.
    return next();
  }

  // Estraiamo gli errori in un formato più pulito e leggibile.
  // Definiamo un tipo per l'oggetto di errore per maggiore chiarezza.
  type FormattedError = { [key: string]: string };

  const extractedErrors: FormattedError[] = [];
  errors.array().map((err: any) => { // Usiamo 'any' per err.path che può essere non standard
    if (err.path) {
      extractedErrors.push({ [err.path]: err.msg });
    }
  });

  // Ci sono errori di validazione. Interrompi la catena e invia la risposta.
  res.status(400).json({
    errors: extractedErrors,
  });
};

