# Ejercicios

## Ejercicio Nro. 01:

Realizar un programa que permita el Ingreso de 2 (dos números) (A y B) utilizando variables y realice las siguientes operaciones.

- Muestre la suma de ambos (A + B)
- Muestre la resta (A – B)
- Muestre el Producto de ambos (A * B)
- Muestre el Cociente entre ambos (A / B)

**Nota:** En este último caso, verificar que sucede cuando B es igual a cero. Que sucede con el programa

## Ejercicio Nro. 02:

Realizar un programa que permita ingresar el importe total de una compra que realiza un cliente y sobre el mismo aplicarle un descuento del 15%. Mostrar por consola el importe total de la compra y el descuento del 15% como así también el importe restante final.

## Ejercicio Nro. 03:

Realizar un programa que permita ingresar los totales que una persona pagó por sus servicios en su hogar. El primer valor representará los gastos de energía (luz eléctrica), el segundo valor representará los gastos en comunicación (conectividad a internet), el tercer valor representará los gastos ocasionados por el servicio de agua potable. Se estima que para el siguiente mes estos tres valores incrementarán en un 12,5%, 7% y 3% respectivamente. El programa debe calcular el gasto futuro a pagar.

## Ejercicio Nro. 04: Estructuras Condicionales (if/else)

Ingrese un número y determine si es positivo o negativo usando una estructura condicional if/else y también resuelva el mismo problema utilizando un operador ternario.

## Ejercicio Nro. 05: Estructuras Condicionales (if/else)

Realizar un programa que permita introducir un valor (X) y determinar si el mismo es PAR ó IMPAR.

## Ejercicio Nro. 06: Estructuras Condicionales (if/else)

Banco Nación de la República Argentina, tiene una promoción muy importante para sus clientes denominada “one shot” que consta en realizar un importante descuento del 50% en las compras del cliente, teniendo en cuenta que el descuento máximo a otorgar (descuento tope) es equivalente a 80.000,00 (ochenta mil pesos argentinos).

Realice un programa que permita introducir el valor de la compra y calcular el porcentaje de descuento sabiendo que no se puede pasar el límite establecido.

## Ejercicio Nro. 07: Estructuras Condicionales (if/else)

Un comercio que vende bolsas de alimentos para mascotas trabaja y comercializa únicamente con tres grandes marcas de alimentos para perros lo que le permite trabajar con descuentos muy interesantes para sus clientes. Las marcas con las que trabaja son:

| Codigo | Descripción | x unidad | Catálogo de Productos (cantidad >= 5) y (cantidad <=10) | Cantidad >= 11 |
|---|---|---:|---:|---:|
| 1 | Dogui x 21 kil. | $ 38.000,00 | $ 36.000,00 | $ 34.000,00 |
| 2 | Tiernitos x 21 kil | $ 31.000,00 | $ 29.000,00 | $ 27.000,00 |
| 3 | Dogpro x 21 kil | $ 46.000,00 | $ 44.000,00 | $ 42.000,00 |

Realice un programa en JavaScript que permita ingresar el código del producto y la cantidad de bolsas a comprar y que solo determine el importe total a pagar.

## Ejercicio Nro. 08: Estructuras Condicionales (if/else)

Realizar un programa que permita ingresar la edad de una persona y determine si es niño (0 a 12 años), adolescente (13 a 17 años), adulto (18 a 64 años), adulto mayor (más de 64 años).

## Ejercicio Nro. 09: Estructuras Condicionales (if/else)

Una plataforma de venta de pasajes (terrestres) desea realizar una aplicación web que permita realizar la venta de los mismos, para ello el dueño propone las siguientes reglas tratando de promover las ventas.

- Si la cantidad de Pasajes es mayor a 3 y el importe total de la compra es mayor a 250.000,00 pesos, se aplicará un descuento del 11% sobre el total de la compra.
- Si la cantidad de pasajes es mayor a 3 y el importe total de la compra es mayor a 500.000,00 pesos, se aplicará un descuento del 15% sobre el total de la compra.

El Sistema debe registrar mínimamente estas variables:

- cantidad de pasajes
- importe pasaje
- total compra = cantidad de pasajes * importe pasaje

## Ejercicio Nro. 10: Estructuras Condicionales (if/else)

Un comercio aplica descuentos sobre el importe de compra según forma de pago:

1. Efectivo → 10% descuento
2. Débito → 5% descuento
3. Crédito → Sin descuento

Calcular el descuento y Mostrar total final. Utilizar estructura switch

## Ejercicio Nro. 11: Estructuras Condicionales (if/else)

Un local de venta de comida rápida, lanza su aplicación online que le permite al cliente pagar por la misma y además aclara que se incluye en el precio total el costo del envío dependiendo la zona en la que vive el cliente.

1. Zona Centro = $ 2500,00
2. Zona Oeste = $ 3750,00
3. Zona Norte = $ 4225,00
4. Zona Sur = $ 5222,50
5. Zona Este = $ 4288,50

Debe ingresar el importe de la compra, sumarle el costo del envío en función de la zona del cliente.

**Recomendación:** Es mejor guardar los costos de envío en variables, de tal forma que si en un futuro cambian, no haya que tocar la lógica del programa, ni ver todo el recorrido, sino simplemente cambiar los precios.

## Ejercicio Nro. 12: Estructuras Condicionales (if/else)

El programa One Shot Plus fue un beneficio implementado en la provincia de Catamarca en conjunto con el Banco Nación para incentivar el consumo en comercios locales.

El beneficio consistía en:

- 50% de reintegro sobre el monto de la compra
- tope máximo de reintegro: $80.000
- válido para compras realizadas los días viernes, sábado y domingo

El programa debe:

1. Solicitar al usuario:
   - el día de la compra
   - el importe de la compra

2. Verificar si la compra fue realizada un viernes, sábado o domingo.
   - Si no fue uno de esos días, no se aplica el beneficio.

3. Si corresponde el beneficio:
   - calcular el 50% del importe de la compra
   - verificar si el reintegro supera el tope de $80.000
   - si lo supera, aplicar solamente el tope

4. Mostrar:
   - día de la compra
   - importe de la compra
   - reintegro obtenido
   - importe final pagado por el cliente.

## Ejercicio Nro. 13: Estructuras Condicionales (if/else)

El programa Marcatón, realizado en Catamarca junto al Banco Nación, ofrece descuentos en distintos rubros comerciales.

**Tabla de descuentos:**

| Rubro | Descuento | Tope máximo |
|---|---:|---:|
| Vestimenta | 20% | $80.000 |
| Perfumería | 20% | $80.000 |
| Librería | 30% | $90.000 |
| Electrodomésticos | 15% | $70.000 |
| Calzado | 20% | $80.000 |

El programa debe:

1. Solicitar el rubro del comercio.
2. Solicitar el importe de la compra.
3. Calcular el descuento correspondiente.
4. Verificar si el descuento supera el tope del rubro. Si lo supera, aplicar solo el tope.

5. Mostrar:
   - rubro
   - importe de la compra
   - descuento aplicado
   - importe final a pagar.
