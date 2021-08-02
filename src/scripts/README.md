# FieldHero Scripts

## Note
- Scripts in this folder are for development purpose. Be cautious before using them.
- They have added to **exclude** list of `tsconfig.json`. So, it won't be processed by `tsc`(TypeScript).

## How to run
#### Run from terminal
```bash
# npm run tsnode -- <path-to-script>
npm run tsnode -- src/scripts/debug.ts
```
#### Run with debugging
VSCode debugging is already setup into the project.<br/>
**Steps**
1. Press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> to bring command pallet.
2. Select **Debug: Select and Start Debugging**
3. Select **Launch Debug Script**

This will launch `src/scripts/debug.ts` file into debugging mode.

## Migration
#### Steps
1. Deploy **server** build on your server using `caprover`
2. Deploy **client/portal** build on your server using `caprover`
3. Update database with `third_seed.ts` file using appropriate `DATABASE_URL` for `Prisma`
4. Modify data to support new structure using `migration.ts`