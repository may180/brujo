-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-03-2024 a las 20:55:02
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `maikol`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `consulta_servicios`
--

CREATE TABLE `consulta_servicios` (
  `id_consulta` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_servicio` int(11) DEFAULT NULL,
  `fecha_consulta` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` int(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `consulta_servicios`
--

INSERT INTO `consulta_servicios` (`id_consulta`, `id_user`, `id_servicio`, `fecha_consulta`, `estado`) VALUES
(1, 10, 4, '2024-03-18 17:49:11', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre_rol` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre_rol`) VALUES
(1, 'admin'),
(2, 'user');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicio`
--

CREATE TABLE `servicio` (
  `id_servicio` int(11) NOT NULL,
  `nombre_servicio` varchar(255) DEFAULT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `id_administrador` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicio`
--

INSERT INTO `servicio` (`id_servicio`, `nombre_servicio`, `descripcion`, `id_administrador`) VALUES
(1, 'Amarres de Amor', 'Recupera a tu ser amado con nuestros poderosos amarres de amor.', NULL),
(2, 'Hechizos Poderosos', 'Descubre el poder de los hechizos para cambiar tu destino.', NULL),
(3, 'Protección Mística', 'Escudos místicos para protegerte de energías negativas..', NULL),
(4, 'Lectura de Cartas ', 'Descubre tu destino a través de una lectura de cartas personalizada.', NULL),
(5, 'Amuletos de la Suerte', 'Encuentra amuletos y talismanes para atraer la buena suerte.', NULL),
(6, 'Rituales Esotéricos', 'Participa en rituales esotéricos para potenciar tus energías..', NULL),
(7, 'Magia Blanca', 'Descubre los principios de la magia blanca para el bienestar', NULL),
(8, 'Santería y Rituales', 'Explora la santería y sus rituales para el equilibrio espiritual.', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id_user` int(11) NOT NULL,
  `rol` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `cc` int(10) NOT NULL,
  `contraseña` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id_user`, `rol`, `nombre`, `cc`, `contraseña`) VALUES
(1, 2, '', 0, ''),
(6, 2, 'hansen', 1234567890, 'Contraseña!1'),
(9, 1, 'huevo', 1234567890, 'Contraseña*1'),
(10, 1, 'maicol', 1234567890, 'Contraseña!1');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `consulta_servicios`
--
ALTER TABLE `consulta_servicios`
  ADD PRIMARY KEY (`id_consulta`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_servicio` (`id_servicio`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `servicio`
--
ALTER TABLE `servicio`
  ADD PRIMARY KEY (`id_servicio`),
  ADD KEY `id_administrador` (`id_administrador`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`),
  ADD KEY `rol` (`rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `consulta_servicios`
--
ALTER TABLE `consulta_servicios`
  MODIFY `id_consulta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `servicio`
--
ALTER TABLE `servicio`
  MODIFY `id_servicio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `consulta_servicios`
--
ALTER TABLE `consulta_servicios`
  ADD CONSTRAINT `consulta_servicios_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  ADD CONSTRAINT `consulta_servicios_ibfk_2` FOREIGN KEY (`id_servicio`) REFERENCES `servicio` (`id_servicio`);

--
-- Filtros para la tabla `servicio`
--
ALTER TABLE `servicio`
  ADD CONSTRAINT `servicio_ibfk_1` FOREIGN KEY (`id_administrador`) REFERENCES `administradores` (`id_administrador`);

--
-- Filtros para la tabla `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`rol`) REFERENCES `roles` (`id_rol`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
